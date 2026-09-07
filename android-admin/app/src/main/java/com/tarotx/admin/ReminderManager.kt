package com.tarotx.admin

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

object ReminderManager {

    private const val TAG = "TarotXReminderManager"
    const val CHANNEL_MEETING_ID = "tarotx_meeting_reminders"
    const val CHANNEL_BOOKING_ID = "tarotx_new_bookings"
    private const val PREFS_NAME = "tarotx_reminders_prefs"
    private const val KEY_SCHEDULED_BOOKINGS = "scheduled_bookings_list"

    fun initNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            // 1. Meeting Reminder Channel (High Priority with Sound & Full Screen)
            val meetingChannel = NotificationChannel(
                CHANNEL_MEETING_ID,
                "Consultation Meeting Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Urgent 5-minute pre-meeting consultation alarms and full-screen alerts"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 600, 200, 600, 200, 600)
                setSound(soundUri, audioAttributes)
                lockscreenVisibility = NotificationManager.IMPORTANCE_HIGH
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    setBypassDnd(true)
                }
            }
            nm.createNotificationChannel(meetingChannel)

            // 2. New Booking Channel
            val bookingChannel = NotificationChannel(
                CHANNEL_BOOKING_ID,
                "New Client Bookings",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time alerts whenever a new consultation is booked"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 400, 200, 400)
                setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), audioAttributes)
            }
            nm.createNotificationChannel(bookingChannel)
            Log.d(TAG, "Notification channels initialized successfully")
        }
    }

    /**
     * Schedules a 5-minute pre-meeting alarm using Android AlarmManager.
     */
    fun scheduleFiveMinuteReminder(
        context: Context,
        bookingId: String,
        clientName: String,
        serviceTitle: String,
        scheduledEpochMs: Long,
        zoomUrl: String = "",
        phone: String = "",
        focusArea: String = ""
    ) {
        val now = System.currentTimeMillis()
        val alarmTime = scheduledEpochMs - (5 * 60 * 1000) // 5 minutes before

        if (alarmTime <= now) {
            Log.d(TAG, "Meeting time is already within 5 minutes or in the past: bookingId=$bookingId")
            return
        }

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, MeetingAlarmReceiver::class.java).apply {
            action = MeetingAlarmReceiver.ACTION_MEETING_REMINDER
            putExtra(MeetingAlarmReceiver.EXTRA_BOOKING_ID, bookingId)
            putExtra(MeetingAlarmReceiver.EXTRA_CLIENT_NAME, clientName)
            putExtra(MeetingAlarmReceiver.EXTRA_SERVICE_TITLE, serviceTitle)
            putExtra(MeetingAlarmReceiver.EXTRA_SCHEDULED_TIME, scheduledEpochMs)
            putExtra(MeetingAlarmReceiver.EXTRA_ZOOM_URL, zoomUrl)
            putExtra(MeetingAlarmReceiver.EXTRA_PHONE, phone)
            putExtra(MeetingAlarmReceiver.EXTRA_FOCUS_AREA, focusArea)
            putExtra(MeetingAlarmReceiver.EXTRA_IS_TEST, false)
        }

        val requestCode = bookingId.hashCode()
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Use AlarmClockInfo to guarantee wake-up even in Android Doze mode
        val showIntent = Intent(context, MainActivity::class.java)
        val showPendingIntent = PendingIntent.getActivity(
            context,
            requestCode,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val clockInfo = AlarmManager.AlarmClockInfo(alarmTime, showPendingIntent)
        alarmManager.setAlarmClock(clockInfo, pendingIntent)

        // Save in persistent preferences for reboot restoration
        saveScheduledBooking(
            context,
            bookingId,
            clientName,
            serviceTitle,
            scheduledEpochMs,
            zoomUrl,
            phone,
            focusArea
        )

        val diffMinutes = (alarmTime - now) / 60000
        Log.d(TAG, "Scheduled 5-minute reminder for $clientName at epoch $alarmTime (in $diffMinutes mins)")
    }

    /**
     * Schedules a test meeting alarm that triggers after [delaySeconds] seconds.
     */
    fun scheduleTestAlarm(context: Context, delaySeconds: Int = 5) {
        val now = System.currentTimeMillis()
        val alarmTime = now + (delaySeconds * 1000L)

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, MeetingAlarmReceiver::class.java).apply {
            action = MeetingAlarmReceiver.ACTION_MEETING_REMINDER
            putExtra(MeetingAlarmReceiver.EXTRA_BOOKING_ID, "test_live_reading_001")
            putExtra(MeetingAlarmReceiver.EXTRA_CLIENT_NAME, "Aarav Mehta (Test)")
            putExtra(MeetingAlarmReceiver.EXTRA_SERVICE_TITLE, "1-to-1 Live Zoom Reading")
            putExtra(MeetingAlarmReceiver.EXTRA_SCHEDULED_TIME, now + (5 * 60 * 1000L)) // 5 mins from now
            putExtra(MeetingAlarmReceiver.EXTRA_ZOOM_URL, "https://zoom.us/j/9876543210")
            putExtra(MeetingAlarmReceiver.EXTRA_PHONE, "+91 98201 44521")
            putExtra(MeetingAlarmReceiver.EXTRA_FOCUS_AREA, "Career & High-Stakes Venture Strategy")
            putExtra(MeetingAlarmReceiver.EXTRA_IS_TEST, true)
        }

        val requestCode = 999999
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val showIntent = Intent(context, MainActivity::class.java)
        val showPendingIntent = PendingIntent.getActivity(
            context,
            requestCode,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val clockInfo = AlarmManager.AlarmClockInfo(alarmTime, showPendingIntent)
        alarmManager.setAlarmClock(clockInfo, pendingIntent)
        Log.d(TAG, "Scheduled TEST meeting alarm for $delaySeconds seconds from now")
    }

    /**
     * Triggers an immediate new client booking popup alert.
     */
    fun triggerNewBookingAlert(
        context: Context,
        bookingId: String,
        clientName: String,
        serviceTitle: String,
        inrAmount: Int,
        preferredDate: String,
        preferredTime: String,
        phone: String = ""
    ) {
        val intent = Intent(context, ReminderPopupActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(MeetingAlarmReceiver.EXTRA_TYPE, "NEW_BOOKING")
            putExtra(MeetingAlarmReceiver.EXTRA_BOOKING_ID, bookingId)
            putExtra(MeetingAlarmReceiver.EXTRA_CLIENT_NAME, clientName)
            putExtra(MeetingAlarmReceiver.EXTRA_SERVICE_TITLE, serviceTitle)
            putExtra(MeetingAlarmReceiver.EXTRA_AMOUNT, inrAmount)
            putExtra(MeetingAlarmReceiver.EXTRA_DATE_STR, preferredDate)
            putExtra(MeetingAlarmReceiver.EXTRA_TIME_STR, preferredTime)
            putExtra(MeetingAlarmReceiver.EXTRA_PHONE, phone)
        }
        context.startActivity(intent)
    }

    /**
     * Parses a booking JSON object from web dashboard and sets up its 5-minute pre-meeting alarm.
     */
    fun syncBookingFromJson(context: Context, bookingObj: JSONObject) {
        try {
            val id = bookingObj.optString("id", "")
            val name = bookingObj.optString("name", "Client")
            val service = bookingObj.optString("service_title", "Consultation")
            val prefDate = bookingObj.optString("preferred_date", "")
            val prefTime = bookingObj.optString("preferred_time", "")
            val phone = bookingObj.optString("phone", "")
            val notes = bookingObj.optString("focusArea", bookingObj.optString("notes", ""))
            val status = bookingObj.optString("status", "")

            // Only schedule for confirmed or in-progress live readings
            if (status.equals("cancelled", ignoreCase = true) || status.equals("completed", ignoreCase = true)) {
                cancelReminder(context, id)
                return
            }

            if (service.contains("Live", ignoreCase = true) || service.contains("Zoom", ignoreCase = true)) {
                val epochMs = parseDateTimeToEpoch(prefDate, prefTime)
                if (epochMs > System.currentTimeMillis()) {
                    scheduleFiveMinuteReminder(
                        context = context,
                        bookingId = id,
                        clientName = name,
                        serviceTitle = service,
                        scheduledEpochMs = epochMs,
                        zoomUrl = "https://zoom.us/j/tarotx_${id.takeLast(6)}",
                        phone = phone,
                        focusArea = notes
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error syncing booking: ${e.message}", e)
        }
    }

    fun syncAllBookingsFromJsonArray(context: Context, jsonArrayStr: String) {
        try {
            val array = JSONArray(jsonArrayStr)
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                syncBookingFromJson(context, obj)
            }
            Log.d(TAG, "Synced ${array.length()} bookings from Admin Dashboard")
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing bookings JSON array: ${e.message}", e)
        }
    }

    fun cancelReminder(context: Context, bookingId: String) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, MeetingAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            bookingId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
        removeScheduledBooking(context, bookingId)
    }

    fun rescheduleAllOnBoot(context: Context) {
        val list = getSavedBookings(context)
        val now = System.currentTimeMillis()
        for (i in 0 until list.length()) {
            val item = list.getJSONObject(i)
            val epoch = item.optLong("scheduledEpochMs", 0L)
            if (epoch - (5 * 60 * 1000) > now) {
                scheduleFiveMinuteReminder(
                    context,
                    item.getString("bookingId"),
                    item.getString("clientName"),
                    item.getString("serviceTitle"),
                    epoch,
                    item.optString("zoomUrl", ""),
                    item.optString("phone", ""),
                    item.optString("focusArea", "")
                )
            }
        }
    }

    private fun parseDateTimeToEpoch(dateStr: String, timeStr: String): Long {
        if (dateStr.isBlank()) return 0L
        val cleanTime = if (timeStr.contains(":") && timeStr.length >= 4) {
            val parts = timeStr.trim().split(" ")[0].split(":")
            String.format(Locale.getDefault(), "%02d:%02d", parts[0].toIntOrNull() ?: 18, parts[1].toIntOrNull() ?: 0)
        } else {
            "18:00"
        }
        val fullStr = "$dateStr $cleanTime"
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).apply {
            timeZone = TimeZone.getTimeZone("Asia/Kolkata")
        }
        return try {
            sdf.parse(fullStr)?.time ?: 0L
        } catch (e: Exception) {
            0L
        }
    }

    private fun saveScheduledBooking(
        context: Context,
        bookingId: String,
        clientName: String,
        serviceTitle: String,
        scheduledEpochMs: Long,
        zoomUrl: String,
        phone: String,
        focusArea: String
    ) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_SCHEDULED_BOOKINGS, "[]") ?: "[]"
        val arr = JSONArray(raw)
        val newArr = JSONArray()

        val newObj = JSONObject().apply {
            put("bookingId", bookingId)
            put("clientName", clientName)
            put("serviceTitle", serviceTitle)
            put("scheduledEpochMs", scheduledEpochMs)
            put("zoomUrl", zoomUrl)
            put("phone", phone)
            put("focusArea", focusArea)
        }
        newArr.put(newObj)

        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optString("bookingId") != bookingId) {
                newArr.put(item)
            }
        }

        prefs.edit().putString(KEY_SCHEDULED_BOOKINGS, newArr.toString()).apply()
    }

    private fun removeScheduledBooking(context: Context, bookingId: String) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_SCHEDULED_BOOKINGS, "[]") ?: "[]"
        val arr = JSONArray(raw)
        val newArr = JSONArray()
        for (i in 0 until arr.length()) {
            val item = arr.getJSONObject(i)
            if (item.optString("bookingId") != bookingId) {
                newArr.put(item)
            }
        }
        prefs.edit().putString(KEY_SCHEDULED_BOOKINGS, newArr.toString()).apply()
    }

    private fun getSavedBookings(context: Context): JSONArray {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_SCHEDULED_BOOKINGS, "[]") ?: "[]"
        return JSONArray(raw)
    }
}
