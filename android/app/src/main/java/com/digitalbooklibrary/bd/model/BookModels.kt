package com.digitalbooklibrary.bd.model

data class Book(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val authorBn: String,
    val authorEn: String,
    val category: String,
    val categoryBn: String,
    val descriptionBn: String,
    val priceBDT: Int,
    val coverImage: String,
    val isPublished: Boolean,
    val pagesCount: Int,
    val isFreeToRead: Boolean = true
)

data class ReaderPage(
    val pageNumber: Int,
    val chapterBn: String,
    val titleBn: String,
    val contentBn: String
)

data class PurchaseRecord(
    val orderId: String,
    val userId: String,
    val bookId: String,
    val bookTitleBn: String,
    val amountBDT: Int,
    val paymentTrxId: String,
    val status: String,
    val verifiedAt: String
)

data class BkashPaymentRequest(
    val bookId: String,
    val userId: String,
    val userEmail: String
)

data class BkashPaymentResponse(
    val success: Boolean,
    val orderId: String,
    val paymentID: String,
    val amountBDT: Int,
    val currency: String,
    val error: String? = null
)

data class BkashExecuteRequest(
    val paymentID: String,
    val trxID: String? = null
)

data class DownloadTokenResponse(
    val success: Boolean,
    val downloadToken: String,
    val downloadUrl: String,
    val expiresInSeconds: Int,
    val error: String? = null
)
