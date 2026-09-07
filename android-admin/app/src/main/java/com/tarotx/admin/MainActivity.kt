package com.tarotx.admin

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.util.Base64
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : ComponentActivity() {

    companion object {
        const val ADMIN_URL = "https://tarot-x-official.vercel.app/?admin_app=1#admin"
        const val USER_AGENT_SUFFIX = " TarotXAdmin/1.0"
        const val COLOR_OBSIDIAN = "#08070B"
        const val COLOR_SURFACE = "#121018"
        const val COLOR_GOLD = "#E2B857"
        const val COLOR_GOLD_MUTED = "#9C7A2E"
    }

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: LinearLayout
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Window status bar & navigation bar theme
        window.statusBarColor = Color.parseColor(COLOR_OBSIDIAN)
        window.navigationBarColor = Color.parseColor(COLOR_OBSIDIAN)

        // Root FrameLayout
        val rootLayout = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor(COLOR_OBSIDIAN))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        // Pull to refresh layout
        swipeRefresh = SwipeRefreshLayout(this).apply {
            setColorSchemeColors(Color.parseColor(COLOR_GOLD), Color.parseColor("#FFD700"))
            setProgressBackgroundColorSchemeColor(Color.parseColor(COLOR_SURFACE))
            setOnRefreshListener {
                if (isNetworkAvailable()) {
                    webView.reload()
                } else {
                    isRefreshing = false
                    showOfflineScreen()
                }
            }
        }

        // Hardware accelerated WebView
        webView = WebView(this).apply {
            setBackgroundColor(Color.parseColor(COLOR_OBSIDIAN))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setLayerType(View.LAYER_TYPE_HARDWARE, null)

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                cacheMode = WebSettings.LOAD_DEFAULT
                userAgentString = "$userAgentString$USER_AGENT_SUFFIX"
                useWideViewPort = true
                loadWithOverviewMode = true
                displayZoomControls = false
                builtInZoomControls = false
                mediaPlaybackRequiresUserGesture = false
                mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            }
        }

        // Top gold progress bar
        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            val heightPx = (3 * resources.displayMetrics.density).toInt()
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, heightPx).apply {
                gravity = Gravity.TOP
            }
            isIndeterminate = false
            max = 100
            progressDrawable.setTint(Color.parseColor(COLOR_GOLD))
            visibility = View.VISIBLE
        }

        // Offline Error Screen
        errorLayout = createOfflineLayout()

        // Setup Clients and Listeners
        setupWebClients()
        setupDownloadListener()

        // Back press handling
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    showExitConfirmDialog()
                }
            }
        })

        // Compose hierarchy
        swipeRefresh.addView(webView)
        rootLayout.addView(swipeRefresh)
        rootLayout.addView(errorLayout)
        rootLayout.addView(progressBar)

        setContentView(rootLayout)

        // Load Admin Console
        loadAdminUrl()
    }

    private fun loadAdminUrl() {
        if (isNetworkAvailable()) {
            hideOfflineScreen()
            webView.loadUrl(ADMIN_URL)
        } else {
            showOfflineScreen()
        }
    }

    private fun setupWebClients() {
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                progressBar.progress = 15
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
                hideOfflineScreen()
            }

            override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
                if (!isNetworkAvailable()) {
                    showOfflineScreen()
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // If URL is within Tarot X domain
                if (url.contains("tarot-x-official.vercel.app") || url.contains("localhost")) {
                    // Check if attempting to navigate out of admin console to public site
                    val isLeavingAdmin = !url.contains("#admin") && !url.contains("/admin") && !url.contains("admin=true") && !url.contains("admin_app=1")
                    if (isLeavingAdmin) {
                        // Redirect back to Admin Console
                        view?.loadUrl(ADMIN_URL)
                        return true
                    }
                    return false
                }

                // External links (tel, mailto, external URL): open via Android Intent
                try {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Cannot open external link", Toast.LENGTH_SHORT).show()
                }
                return true
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress >= 100) {
                    progressBar.visibility = View.GONE
                } else {
                    progressBar.visibility = View.VISIBLE
                }
            }

            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("Tarot X Admin")
                    .setMessage(message)
                    .setPositiveButton("OK") { _, _ -> result?.confirm() }
                    .setOnCancelListener { result?.cancel() }
                    .show()
                return true
            }

            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("Confirmation")
                    .setMessage(message)
                    .setPositiveButton("Yes") { _, _ -> result?.confirm() }
                    .setNegativeButton("Cancel") { _, _ -> result?.cancel() }
                    .setOnCancelListener { result?.cancel() }
                    .show()
                return true
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                }
                try {
                    startActivityForResult(intent, 1001)
                } catch (e: Exception) {
                    fileUploadCallback = null
                    return false
                }
                return true
            }
        }
    }

    private fun setupDownloadListener() {
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            try {
                if (url.startsWith("data:text/csv") || url.startsWith("data:application/csv")) {
                    handleDataUriDownload(url)
                } else {
                    val request = DownloadManager.Request(Uri.parse(url)).apply {
                        setMimeType(mimetype)
                        addRequestHeader("User-Agent", userAgent)
                        setDescription("Downloading file from Tarot X Admin")
                        setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                        setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        setDestinationInExternalPublicDir(
                            Environment.DIRECTORY_DOWNLOADS,
                            URLUtil.guessFileName(url, contentDisposition, mimetype)
                        )
                    }
                    val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                    dm.enqueue(request)
                    Toast.makeText(this, "Download initiated...", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this, "Failed to download: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun handleDataUriDownload(dataUri: String) {
        try {
            val commaIndex = dataUri.indexOf(',')
            if (commaIndex == -1) return
            val metadata = dataUri.substring(0, commaIndex)
            val dataPart = dataUri.substring(commaIndex + 1)

            val isBase64 = metadata.contains(";base64")
            val bytes = if (isBase64) {
                Base64.decode(dataPart, Base64.DEFAULT)
            } else {
                Uri.decode(dataPart).toByteArray(Charsets.UTF_8)
            }

            val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
            val fileName = "TarotX_Report_$timeStamp.csv"

            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            if (!downloadsDir.exists()) downloadsDir.mkdirs()
            val file = File(downloadsDir, fileName)

            FileOutputStream(file).use { fos ->
                fos.write(bytes)
            }

            Toast.makeText(this, "Export saved to Downloads: $fileName", Toast.LENGTH_LONG).show()

            // Open Share Sheet
            try {
                val fileUri = FileProvider.getUriForFile(
                    this,
                    "${applicationContext.packageName}.provider",
                    file
                )
                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/csv"
                    putExtra(Intent.EXTRA_STREAM, fileUri)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }
                startActivity(Intent.createChooser(shareIntent, "Share Tarot X CSV Report"))
            } catch (_: Exception) {}

        } catch (e: Exception) {
            Toast.makeText(this, "Error saving export: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun createOfflineLayout(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor(COLOR_OBSIDIAN))
            visibility = View.GONE
            setPadding(48, 48, 48, 48)

            // Title
            val titleView = TextView(this@MainActivity).apply {
                text = "SANCTUARY OFFLINE"
                textSize = 20f
                setTextColor(Color.parseColor(COLOR_GOLD))
                typeface = android.graphics.Typeface.SERIF
                gravity = Gravity.CENTER
            }

            // Description
            val descView = TextView(this@MainActivity).apply {
                text = "The admin management console requires an active connection. Please verify your internet or Wi-Fi and reconnect."
                textSize = 13f
                setTextColor(Color.parseColor("#94A3B8"))
                gravity = Gravity.CENTER
                setPadding(0, 24, 0, 40)
            }

            // Retry Button
            val retryBtn = Button(this@MainActivity).apply {
                text = "RECONNECT TO ADMIN"
                setTextColor(Color.parseColor(COLOR_OBSIDIAN))
                setBackgroundColor(Color.parseColor(COLOR_GOLD))
                typeface = android.graphics.Typeface.DEFAULT_BOLD
                textSize = 12f
                setPadding(32, 16, 32, 16)
                setOnClickListener {
                    loadAdminUrl()
                }
            }

            addView(titleView)
            addView(descView)
            addView(retryBtn)
        }
    }

    private fun showOfflineScreen() {
        swipeRefresh.visibility = View.GONE
        errorLayout.visibility = View.VISIBLE
    }

    private fun hideOfflineScreen() {
        errorLayout.visibility = View.GONE
        swipeRefresh.visibility = View.VISIBLE
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun showExitConfirmDialog() {
        AlertDialog.Builder(this)
            .setTitle("Exit Tarot X Admin?")
            .setMessage("Close the executive sanctuary console?")
            .setPositiveButton("Exit") { _, _ -> finish() }
            .setNegativeButton("Stay", null)
            .show()
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1001) {
            val results = WebChromeClient.FileChooserParams.parseResult(resultCode, data)
            fileUploadCallback?.onReceiveValue(results)
            fileUploadCallback = null
        }
    }
}
