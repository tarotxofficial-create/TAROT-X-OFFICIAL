package com.tarotx.admin

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            Log.d("TarotXBootReceiver", "Boot completed detected, restoring scheduled consultation reminders")
            ReminderManager.initNotificationChannels(context)
            ReminderManager.rescheduleAllOnBoot(context)
        }
    }
}
