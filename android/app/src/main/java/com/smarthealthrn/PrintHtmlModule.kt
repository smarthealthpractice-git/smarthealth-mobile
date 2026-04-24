package com.smarthealthrn

import android.content.Context
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.WebView
import android.webkit.WebViewClient
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class PrintHtmlModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PrintHtmlModule"

    @ReactMethod
    fun printHtml(jobName: String, html: String, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }

        UiThreadUtil.runOnUiThread {
            try {
                val webView = WebView(activity)
                webView.settings.javaScriptEnabled = false

                webView.webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView, url: String?) {
                        try {
                            val printManager =
                                activity.getSystemService(Context.PRINT_SERVICE) as PrintManager

                            val adapter = view.createPrintDocumentAdapter(jobName)

                            val attrs = PrintAttributes.Builder()
                                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                                .build()

                            printManager.print(jobName, adapter, attrs)
                            promise.resolve("PRINT_DIALOG_OPENED")
                        } catch (e: Exception) {
                            promise.reject("PRINT_ERROR", e.message, e)
                        }
                    }
                }

                webView.loadDataWithBaseURL(null, html, "text/HTML", "utf-8", null)
            } catch (e: Exception) {
                promise.reject("WEBVIEW_ERROR", e.message, e)
            }
        }
    }
}