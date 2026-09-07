package com.tarotx.admin

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.*
import androidx.activity.ComponentActivity
import java.text.SimpleDateFormat
import java.util.*

class ReminderPopupActivity : ComponentActivity() {

    private var ringtone: Ringtone? = null
    private var vibrator: Vibrator? = null

    companion object {
        const val COLOR_OBSIDIAN = "#08070B"
        const val COLOR_CARD_BG = "#13101C"
        const val COLOR_GOLD = "#E2B857"
        const val COLOR_GOLD_LIGHT = "#F4D789"
        const val COLOR_SLATE = "#94A3B8"
        const val COLOR_MUTED = "#64748B"
        const val COLOR_EMERALD = "#10B981"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Wake screen and show over Keyguard / Lockscreen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val km = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            km.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Set status and navigation bars
        window.statusBarColor = Color.parseColor(COLOR_OBSIDIAN)
        window.navigationBarColor = Color.parseColor(COLOR_OBSIDIAN)

        // 2. Play alert sound and vibration
        startAlertFeedback()

        // 3. Extract Intent Data
        val type = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_TYPE) ?: "MEETING_REMINDER"
        val clientName = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_CLIENT_NAME) ?: "Client"
        val serviceTitle = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_SERVICE_TITLE) ?: "1-to-1 Consultation"
        val scheduledTime = intent.getLongExtra(MeetingAlarmReceiver.EXTRA_SCHEDULED_TIME, 0L)
        val zoomUrl = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_ZOOM_URL) ?: "https://zoom.us"
        val phone = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_PHONE) ?: ""
        val focusArea = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_FOCUS_AREA) ?: ""
        val inrAmount = intent.getIntExtra(MeetingAlarmReceiver.EXTRA_AMOUNT, 0)
        val dateStr = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_DATE_STR) ?: ""
        val timeStr = intent.getStringExtra(MeetingAlarmReceiver.EXTRA_TIME_STR) ?: ""

        // 4. Build Luxury UI View
        val root = buildPopupView(
            isMeetingReminder = (type == "MEETING_REMINDER"),
            clientName = clientName,
            serviceTitle = serviceTitle,
            scheduledEpochMs = scheduledTime,
            dateStr = dateStr,
            timeStr = timeStr,
            inrAmount = inrAmount,
            zoomUrl = zoomUrl,
            phone = phone,
            focusArea = focusArea
        )

        setContentView(root)
    }

    private fun startAlertFeedback() {
        try {
            val alertUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            ringtone = RingtoneManager.getRingtone(this, alertUri)
            ringtone?.audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
            ringtone?.play()

            vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val timings = longArrayOf(0, 500, 200, 500, 200, 500)
                val amplitudes = intArrayOf(0, 255, 0, 255, 0, 255)
                vibrator?.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(longArrayOf(0, 500, 200, 500), -1)
            }
        } catch (_: Exception) {}
    }

    private fun stopAlertFeedback() {
        try {
            if (ringtone?.isPlaying == true) {
                ringtone?.stop()
            }
            vibrator?.cancel()
        } catch (_: Exception) {}
    }

    private fun buildPopupView(
        isMeetingReminder: Boolean,
        clientName: String,
        serviceTitle: String,
        scheduledEpochMs: Long,
        dateStr: String,
        timeStr: String,
        inrAmount: Int,
        zoomUrl: String,
        phone: String,
        focusArea: String
    ): ScrollView {
        val scrollView = ScrollView(this).apply {
            setBackgroundColor(Color.parseColor("#E608070B")) // 90% obsidian backdrop
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            isFillViewport = true
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(40, 60, 40, 60)
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // --- Card Layout with Gold Outline ---
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(48, 48, 48, 48)
            background = GradientDrawable().apply {
                setColor(Color.parseColor(COLOR_CARD_BG))
                cornerRadius = 36f
                setStroke(3, Color.parseColor(COLOR_GOLD))
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Top Category Pill
        val badgePill = TextView(this).apply {
            text = if (isMeetingReminder) "🔮 5 MINUTES BEFORE MEETING" else "✨ NEW CLIENT BOOKING"
            textSize = 11f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor(COLOR_GOLD))
            setPadding(28, 12, 28, 12)
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#33E2B857"))
                cornerRadius = 40f
                setStroke(1, Color.parseColor(COLOR_GOLD))
            }
        }
        card.addView(badgePill)

        // Main Alert Heading
        val headerTitle = TextView(this).apply {
            text = if (isMeetingReminder) "Consultation Alert" else "Live Booking Confirmed"
            textSize = 22f
            typeface = Typeface.SERIF
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 8)
        }
        card.addView(headerTitle)

        // Subtitle Time Indicator
        val timeSub = TextView(this).apply {
            text = if (isMeetingReminder) {
                val timeFmt = if (scheduledEpochMs > 0) {
                    SimpleDateFormat("hh:mm a 'IST'", Locale.getDefault()).format(Date(scheduledEpochMs))
                } else "Upcoming"
                "Starting promptly at $timeFmt"
            } else {
                val amt = if (inrAmount > 0) "₹$inrAmount" else "Paid"
                "$amt • $dateStr $timeStr"
            }
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor(COLOR_GOLD_LIGHT))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 24)
        }
        card.addView(timeSub)

        // Client Monogram Avatar Box
        val initial = if (clientName.isNotBlank()) clientName.trim()[0].uppercase() else "C"
        val avatarView = TextView(this).apply {
            text = initial
            textSize = 24f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor(COLOR_GOLD))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(130, 130).apply {
                gravity = Gravity.CENTER_HORIZONTAL
            }
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#1C1829"))
                cornerRadius = 65f
                setStroke(2, Color.parseColor(COLOR_GOLD))
            }
        }
        card.addView(avatarView)

        // Client Full Name
        val nameView = TextView(this).apply {
            text = clientName
            textSize = 20f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 4)
        }
        card.addView(nameView)

        // Service Offering
        val serviceView = TextView(this).apply {
            text = serviceTitle
            textSize = 13f
            setTextColor(Color.parseColor(COLOR_SLATE))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }
        card.addView(serviceView)

        // Focus Area / Notes preview box (if present)
        if (focusArea.isNotBlank()) {
            val focusBox = TextView(this).apply {
                text = "Inquiry: \"$focusArea\""
                textSize = 12f
                setTextColor(Color.parseColor("#CBD5E1"))
                setPadding(24, 20, 24, 20)
                background = GradientDrawable().apply {
                    setColor(Color.parseColor("#0F0D17"))
                    cornerRadius = 18f
                    setStroke(1, Color.parseColor("#334155"))
                }
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 24)
                }
            }
            card.addView(focusBox)
        } else {
            val spacer = View(this).apply {
                layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 24)
            }
            card.addView(spacer)
        }

        // --- Primary Action: START / JOIN ZOOM (if meeting) ---
        if (isMeetingReminder && zoomUrl.isNotBlank()) {
            val zoomBtn = Button(this).apply {
                text = "🎥 START / JOIN ZOOM MEETING"
                setTextColor(Color.parseColor(COLOR_OBSIDIAN))
                typeface = Typeface.DEFAULT_BOLD
                textSize = 13f
                setPadding(24, 28, 24, 28)
                background = GradientDrawable().apply {
                    setColor(Color.parseColor(COLOR_GOLD))
                    cornerRadius = 24f
                }
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 16)
                }
                setOnClickListener {
                    stopAlertFeedback()
                    try {
                        val zoomIntent = Intent(Intent.ACTION_VIEW, Uri.parse(zoomUrl)).apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        startActivity(zoomIntent)
                    } catch (e: Exception) {
                        Toast.makeText(this@ReminderPopupActivity, "Could not open Zoom link: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                    finish()
                }
            }
            card.addView(zoomBtn)
        }

        // Secondary Action Row: WhatsApp & Call
        val contactRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
        }

        if (phone.isNotBlank()) {
            val cleanPhone = phone.replace(" ", "").replace("-", "")

            // WhatsApp button
            val waBtn = Button(this).apply {
                text = "💬 WhatsApp"
                setTextColor(Color.parseColor(COLOR_EMERALD))
                textSize = 12f
                typeface = Typeface.DEFAULT_BOLD
                background = GradientDrawable().apply {
                    setColor(Color.parseColor("#15241D"))
                    cornerRadius = 20f
                    setStroke(1, Color.parseColor(COLOR_EMERALD))
                }
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                    setMargins(0, 0, 8, 0)
                }
                setOnClickListener {
                    stopAlertFeedback()
                    try {
                        val greeting = if (isMeetingReminder) {
                            "Hello $clientName, this is your Tarot X reader. I will be connecting with you on Zoom in 5 minutes for our consultation."
                        } else {
                            "Hello $clientName, thank you for booking your Tarot X consultation. We have confirmed your session."
                        }
                        val waUrl = "https://wa.me/${cleanPhone.removePrefix("+")}?text=${Uri.encode(greeting)}"
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(waUrl)))
                    } catch (_: Exception) {
                        Toast.makeText(this@ReminderPopupActivity, "WhatsApp not available", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            contactRow.addView(waBtn)

            // Phone Call button
            val callBtn = Button(this).apply {
                text = "📞 Direct Call"
                setTextColor(Color.parseColor("#60A5FA"))
                textSize = 12f
                typeface = Typeface.DEFAULT_BOLD
                background = GradientDrawable().apply {
                    setColor(Color.parseColor("#121E33"))
                    cornerRadius = 20f
                    setStroke(1, Color.parseColor("#3B82F6"))
                }
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                    setMargins(8, 0, 0, 0)
                }
                setOnClickListener {
                    stopAlertFeedback()
                    try {
                        startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:$cleanPhone")))
                    } catch (_: Exception) {
                        Toast.makeText(this@ReminderPopupActivity, "Phone dialer unavailable", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            contactRow.addView(callBtn)
            card.addView(contactRow)
        }

        // Open Admin Console button
        val adminBtn = Button(this).apply {
            text = "🏛️ Open in Admin Console"
            setTextColor(Color.parseColor(COLOR_GOLD))
            textSize = 12f
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#1E1A29"))
                cornerRadius = 20f
                setStroke(1, Color.parseColor("#443A59"))
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
            setOnClickListener {
                stopAlertFeedback()
                val mainIntent = Intent(this@ReminderPopupActivity, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(mainIntent)
                finish()
            }
        }
        card.addView(adminBtn)

        // Dismiss button
        val dismissBtn = TextView(this).apply {
            text = "✕ Dismiss Alert"
            textSize = 12f
            setTextColor(Color.parseColor(COLOR_MUTED))
            gravity = Gravity.CENTER
            setPadding(0, 12, 0, 12)
            setOnClickListener {
                stopAlertFeedback()
                finish()
            }
        }
        card.addView(dismissBtn)

        container.addView(card)
        scrollView.addView(container)
        return scrollView
    }

    override fun onDestroy() {
        stopAlertFeedback()
        super.onDestroy()
    }

    override fun onPause() {
        stopAlertFeedback()
        super.onPause()
    }
}
