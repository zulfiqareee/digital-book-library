import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Terminal } from 'lucide-react';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'repo' | 'bkash' | 'gradle' | 'rules'>('main');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    main: `// MainActivity.kt - Digital Book Library Android
package com.digitalbooklibrary.bd

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DigitalBookLibraryTheme {
                MainAppScaffold()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold() {
    val navController = rememberNavController()
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("ডিজিটাল বই লাইব্রেরি", style = MaterialTheme.typography.titleMedium) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceColorAtElevation(3.dp)
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { /* Navigate Home */ },
                    icon = { Icon(Icons.Default.Home, contentDescription = "হোম") },
                    label = { Text("হোম") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = { /* Navigate Books */ },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = "বইসমূহ") },
                    label = { Text("বইসমূহ") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = { /* Navigate Library */ },
                    icon = { Icon(Icons.Default.CollectionsBookmark, contentDescription = "লাইব্রেরি") },
                    label = { Text("লাইব্রেরি") }
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            // Screen NavHost
        }
    }
}`,
    repo: `// BookRepository.kt - Repository Pattern for Protected Delivery & bKash
package com.digitalbooklibrary.bd.data.repository

import com.digitalbooklibrary.bd.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class BookRepository(private val apiService: LibraryApiService) {

    suspend fun getPublishedBooks(): List<Book> = withContext(Dispatchers.IO) {
        val response = apiService.fetchPublishedBooks()
        if (response.isSuccessful) response.body()?.books ?: emptyList()
        else throw Exception("বই লোড করতে ব্যর্থ হয়েছে")
    }

    suspend fun initiateBkashCheckout(bookId: String, userId: String): BkashPaymentResponse =
        withContext(Dispatchers.IO) {
            val response = apiService.createBkashPayment(BkashPaymentRequest(bookId, userId))
            response.body() ?: throw Exception("বিকাশ চেকআউট শুরু করা যায়নি")
        }

    suspend fun verifyAndExecutePayment(paymentId: String, trxId: String): Boolean =
        withContext(Dispatchers.IO) {
            val res = apiService.executeBkashPayment(BkashExecuteRequest(paymentId, trxId))
            res.isSuccessful && res.body()?.status == "COMPLETED"
        }

    suspend fun requestDownloadToken(bookId: String, userId: String): String =
        withContext(Dispatchers.IO) {
            val res = apiService.requestDownloadToken(bookId, userId)
            if (res.isSuccessful) res.body()?.downloadToken ?: throw Exception("টোকেন অনুপস্থিত")
            else throw Exception("ডাউনলোড অনুমোদিত নয়। অনুগ্রহ করে বিকাশ দিয়ে পেমেন্ট সম্পন্ন করুন।")
        }
}`,
    bkash: `// BkashCheckoutViewModel.kt - Official bKash Merchant Integration
package com.digitalbooklibrary.bd.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.digitalbooklibrary.bd.data.repository.BookRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class BkashUiState {
    object Idle : BkashUiState()
    object Initiating : BkashUiState()
    data class ReadyToPay(val paymentId: String, val amount: Int, val orderId: String) : BkashUiState()
    object VerifyingWithServer : BkashUiState()
    data class Success(val trxId: String, val orderId: String) : BkashUiState()
    data class Error(val messageBn: String) : BkashUiState()
}

class BkashCheckoutViewModel(private val repository: BookRepository) : ViewModel() {
    private val _uiState = MutableStateFlow<BkashUiState>(BkashUiState.Idle)
    val uiState: StateFlow<BkashUiState> = _uiState

    fun startCheckout(bookId: String, userId: String) {
        viewModelScope.launch {
            _uiState.value = BkashUiState.Initiating
            try {
                val res = repository.initiateBkashCheckout(bookId, userId)
                _uiState.value = BkashUiState.ReadyToPay(res.paymentID, res.amountBDT, res.orderId)
            } catch (e: Exception) {
                _uiState.value = BkashUiState.Error("বিকাশ গেটওয়েতে সংযোগ ব্যর্থ: \${e.message}")
            }
        }
    }

    fun executePayment(paymentId: String, simulatedTrxId: String) {
        viewModelScope.launch {
            _uiState.value = BkashUiState.VerifyingWithServer
            try {
                val isSuccess = repository.verifyAndExecutePayment(paymentId, simulatedTrxId)
                if (isSuccess) {
                    _uiState.value = BkashUiState.Success(simulatedTrxId, paymentId)
                } else {
                    _uiState.value = BkashUiState.Error("পেমেন্ট যাচাইকরণ ব্যর্থ হয়েছে। কোনো টাকা কাটা হয়নি।")
                }
            } catch (e: Exception) {
                _uiState.value = BkashUiState.Error(e.message ?: "যাচাইকরণ ত্রুটি")
            }
        }
    }
}`,
    gradle: `// app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.digitalbooklibrary.bd"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.digitalbooklibrary.bd"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.navigation:navigation-compose:2.8.3")
    implementation("io.coil-kt:coil-compose:2.7.0")
    
    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:33.5.1"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    
    // Retrofit & Coroutines
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}`,
    rules: `// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) ||
        request.auth.token.email == 'zulfiqar1hasan@gmail.com'
      );
    }

    match /books/{bookId} {
      allow get, list: if resource.data.isPublished == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    match /purchases/{purchaseId} {
      allow get, list: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow write: if isAdmin(); // Server verified only
    }
  }
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-base font-semibold text-white">
                Android Native Kotlin (Jetpack Compose) সোর্স কোড
              </h2>
              <p className="text-xs text-slate-400">
                Material 3 & MVVM আর্কিটেকচার (Android Studio-তে সরাসরি ব্যবহারের জন্য)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'main'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            MainActivity.kt
          </button>
          <button
            onClick={() => setActiveTab('repo')}
            className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'repo'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            BookRepository.kt
          </button>
          <button
            onClick={() => setActiveTab('bkash')}
            className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'bkash'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            BkashCheckoutViewModel.kt
          </button>
          <button
            onClick={() => setActiveTab('gradle')}
            className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'gradle'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            build.gradle.kts
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'rules'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            firestore.rules
          </button>
        </div>

        {/* Code View Body */}
        <div className="relative flex-1 p-4 bg-slate-950 overflow-y-auto">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-emerald-300 leading-relaxed pr-24 select-all">
            {codeSnippets[activeTab]}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Android Studio-তে সরাসরি তৈরি করতে /android ডিরেক্টরিটি ওপেন করুন।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
