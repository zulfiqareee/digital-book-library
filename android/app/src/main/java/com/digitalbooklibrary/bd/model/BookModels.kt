package com.digitalbooklibrary.bd.model

import com.google.gson.annotations.SerializedName

data class Book(
    val id: String = "",
    val titleBn: String = "",
    val titleEn: String = "",
    val authorBn: String = "",
    val authorEn: String = "",
    val category: String = "General",
    val categoryBn: String = "সাধারণ",
    val descriptionBn: String = "",
    val descriptionEn: String = "",
    val language: String = "Bengali",
    val priceBDT: Int = 0,
    val coverImage: String = "",
    val isPublished: Boolean = true,
    val pagesCount: Int = 0,
    val publishedYear: Int = 2024,
    val rating: Double = 5.0,
    val isFreeToRead: Boolean = true,
    val pdfStorageKey: String = "",
    val createdAt: String = "",
    val updatedAt: String = ""
)

data class AdminMetrics(
    val totalBooks: Int = 0,
    val publishedCount: Int = 0,
    val draftsCount: Int = 0,
    val verifiedOrdersCount: Int = 0,
    val totalRevenueBDT: Int = 0,
    val uniqueCustomersCount: Int = 0,
    val averageOrderValueBDT: Int = 0
)

data class BookListResponse(
    val success: Boolean = false,
    val count: Int = 0,
    val books: List<Book> = emptyList(),
    val error: String? = null
)

data class AdminBookResponse(
    val success: Boolean = false,
    val message: String? = null,
    val book: Book? = null,
    val error: String? = null
)

data class AdminMetricsResponse(
    val success: Boolean = false,
    val metrics: AdminMetrics? = null,
    val error: String? = null
)

data class AdminDeleteResponse(
    val success: Boolean = false,
    val message: String? = null,
    val error: String? = null
)

data class CreateBookPayload(
    val titleBn: String,
    val titleEn: String = "",
    val authorBn: String,
    val authorEn: String = "",
    val category: String = "General",
    val categoryBn: String = "সাধারণ",
    val descriptionBn: String = "",
    val descriptionEn: String = "",
    val language: String = "Bengali",
    val priceBDT: Int,
    val coverImage: String = "",
    val pdfFileName: String = "",
    val pdfDataBuffer: String = "",
    val isPublished: Boolean = true
)

data class ReaderPage(
    val pageNumber: Int,
    val chapterBn: String = "",
    val titleBn: String = "",
    val contentBn: String = ""
)

data class PurchaseRecord(
    val orderId: String = "",
    val userId: String = "",
    val bookId: String = "",
    val bookTitleBn: String = "",
    val amountBDT: Int = 0,
    val paymentTrxId: String = "",
    val status: String = "",
    val verifiedAt: String = ""
)

data class BkashPaymentRequest(
    val bookId: String,
    val userId: String,
    val userEmail: String
)

data class BkashPaymentResponse(
    val success: Boolean = false,
    val orderId: String = "",
    val paymentID: String = "",
    val amountBDT: Int = 0,
    val currency: String = "BDT",
    val error: String? = null
)

data class BkashExecuteRequest(
    val paymentID: String,
    val trxID: String? = null
)

data class DownloadTokenResponse(
    val success: Boolean = false,
    val downloadToken: String = "",
    val downloadUrl: String = "",
    val expiresInSeconds: Int = 0,
    val error: String? = null
)
