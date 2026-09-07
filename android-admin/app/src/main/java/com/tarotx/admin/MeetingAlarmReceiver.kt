package com.tarotx.admin

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.PowerManager
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class MeetingAlarmReceiver : BroadcastReceiver() {

    companion object {
        const val ACTION_MEETING_REMINDER = "com.tarotx.admin.ACTION_MEETING_REMINDER"
        const val EXTRA_TYPE = "EXTRA_TYPE"
        const val EXTRA_BOOKING_ID = "EXTRA_BOOKING_ID"
        const val EXTRA_CLIENT_NAME = "EXTRA_CLIENT_NAME"
        const val EXTRA_SERVICE_TITLE = "EXTRA_SERVICE_TITLE"
        const val EXTRA_SCHEDULED_TIME = "EXTRA_SCHEDULED_TIME"
        const val EXTRA_ZOOM_URL = "EXTRA_ZOOM_URL"
        const val EXTRA_PHONE = "EXTRA_PHONE"
        const val EXTRA_FOCUS_AREA = "EXTRA_FOCUS_AREA"
        const val EXTRA_AMOUNT = "EXTRA_AMOUNT"
        const val EXTRA_DATE_STR = "EXTRA_DATE_STR"
        const val EXTRA_TIME_STR = "EXTRA_TIME_STR"
        const val EXTRA_IS_TEST = "EXTRA_IS_TEST"

        private const val TAG = "MeetingAlarmReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive triggered with action: ${intent.action}")

        // 1. Acquire momentary WakeLock to turn on CPU/Screen
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "TarotX:MeetingWakeLock"
        )
        wakeLock.acquire(10000L) // 10 seconds max

        val bookingId = intent.getStringExtra(EXTRA_BOOKING_ID) ?: "unknown_booking"
        val clientName = intent.getStringExtra(EXTRA_CLIENT_NAME) ?: "Client"
        val serviceTitle = intent.getStringExtra(EXTRA_SERVICE_TITLE) ?: "1-to-1 Consultation"
        val scheduledTime = intent.getLongExtra(EXTRA_SCHEDULED_TIME, System.currentTimeMillis() + (5 * 60 * 1000))
        val zoomUrl = intent.getStringExtra(EXTRA_ZOOM_URL) ?: "https://zoom.us"
        val phone = intent.getStringExtra(EXTRA_PHONE) ?: ""
        val focusArea = intent.getStringExtra(EXTRA_FOCUS_AREA) ?: ""
        val isTest = intent.getBooleanExtra(EXTRA_IS_TEST, false)

        // 2. Prepare Intent to launch the Luxury Popup Screen
        val popupIntent = Intent(context, ReminderPopupActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            putExtra(EXTRA_TYPE, "MEETING_REMINDER")
            putExtra(EXTRA_BOOKING_ID, bookingId)
            putExtra(EXTRA_CLIENT_NAME, clientName)
            putExtra(EXTRA_SERVICE_TITLE, serviceTitle)
            putExtra(EXTRA_SCHEDULED_TIME, scheduledTime)
            putExtra(EXTRA_ZOOM_URL, zoomUrl)
            putExtra(EXTRA_PHONE, phone)
            putExtra(EXTRA_FOCUS_AREA, focusArea)
            putExtra(EXTRA_IS_TEST, isTest)
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            bookingId.hashCode(),
            popupIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // 3. Build Heads-Up Full-Screen Notification
        val notificationId = 1000 + (bookingId.hashCode() % 8000)
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationBuilder = NotificationCompat.Builder(context, ReminderManager.CHANNEL_MEETING_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("🔮 Meeting Starting in 5 Minutes")
            .setContentText("$clientName • $serviceTitle")
            .setStyle(
                NotificationCompat.BigTextStyle().bigText(
                    "Upcoming Live Reading in 5 minutes with $clientName.\nService: $serviceTitle\nTap to start or join Zoom."
                )
            )
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setSound(defaultSoundUri)
            .setVibrate(longArrayOf(0, 600, 200, 600, 200, 600))
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setAutoCancel(true)
            .setContentIntent(fullScreenPendingIntent)

        try {
            val nm = NotificationManagerCompat.from(context)
            nm.notify(notificationId, notificationBuilder.build())
        } catch (e: SecurityException) {
            Log.w(TAG, "Notification permission not granted yet: ${e.message}")
        }

        // 4. Also launch the Popup Activity directly to ensure screen turns on
        try {
            context.startActivity(popupIntent)
            Log.d(TAG, "Started ReminderPopupActivity directly from AlarmReceiver")
        } catch (e: Exception) {
            Log.e(TAG, "Could not launch ReminderPopupActivity directly: ${e.message}", e)
        }
    }
}
