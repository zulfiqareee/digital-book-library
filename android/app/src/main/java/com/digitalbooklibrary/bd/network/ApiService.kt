package com.digitalbooklibrary.bd.network

import com.digitalbooklibrary.bd.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @GET("api/books")
    suspend fun getBooks(
        @Query("includeUnpublished") includeUnpublished: Boolean = true,
        @Header("x-admin-email") adminEmail: String = "zulfiqar1hasan@gmail.com"
    ): Response<BookListResponse>

    @GET("api/admin/metrics")
    suspend fun getMetrics(
        @Header("x-admin-email") adminEmail: String = "zulfiqar1hasan@gmail.com"
    ): Response<AdminMetricsResponse>

    @POST("api/admin/books")
    suspend fun createBook(
        @Header("x-admin-email") adminEmail: String = "zulfiqar1hasan@gmail.com",
        @Body payload: CreateBookPayload
    ): Response<AdminBookResponse>

    @PUT("api/admin/books/{id}")
    suspend fun updateBook(
        @Path("id") id: String,
        @Header("x-admin-email") adminEmail: String = "zulfiqar1hasan@gmail.com",
        @Body payload: CreateBookPayload
    ): Response<AdminBookResponse>

    @DELETE("api/admin/books/{id}")
    suspend fun deleteBook(
        @Path("id") id: String,
        @Header("x-admin-email") adminEmail: String = "zulfiqar1hasan@gmail.com"
    ): Response<AdminDeleteResponse>
}
