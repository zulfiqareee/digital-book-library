package com.digitalbooklibrary.bd.network

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val DEFAULT_BASE_URL = "http://10.0.2.2:3000/"
    private var currentBaseUrl = DEFAULT_BASE_URL
    private var apiService: ApiService? = null

    var adminEmail: String = "zulfiqar1hasan@gmail.com"

    fun getBaseUrl(): String = currentBaseUrl

    fun setBaseUrl(newUrl: String) {
        val sanitized = if (newUrl.endsWith("/")) newUrl else "$newUrl/"
        currentBaseUrl = sanitized
        apiService = null
    }

    fun getService(): ApiService {
        return apiService ?: synchronized(this) {
            val okHttpClient = OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build()

            val gson = GsonBuilder()
                .setLenient()
                .create()

            val retrofit = Retrofit.Builder()
                .baseUrl(currentBaseUrl)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()

            val service = retrofit.create(ApiService::class.java)
            apiService = service
            service
        }
    }
}
