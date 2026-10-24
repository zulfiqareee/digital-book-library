package com.digitalbooklibrary.bd.ui.admin

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import android.util.Base64
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.digitalbooklibrary.bd.model.AdminMetrics
import com.digitalbooklibrary.bd.model.Book
import com.digitalbooklibrary.bd.model.CreateBookPayload
import com.digitalbooklibrary.bd.network.ApiClient
import com.digitalbooklibrary.bd.repository.BookRepository
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var books by remember { mutableStateOf<List<Book>>(emptyList()) }
    var metrics by remember { mutableStateOf(AdminMetrics()) }
    var isLoading by remember { mutableStateOf(true) }
    var searchQuery by remember { mutableStateOf("") }

    // Dialog states
    var showUploadDialog by remember { mutableStateOf(false) }
    var bookToEdit by remember { mutableStateOf<Book?>(null) }
    var bookToDelete by remember { mutableStateOf<Book?>(null) }
    var showServerConfigDialog by remember { mutableStateOf(false) }

    fun refreshData() {
        isLoading = true
        coroutineScope.launch {
            val booksRes = BookRepository.getBooks()
            val metricsRes = BookRepository.getMetrics()
            if (booksRes.isSuccess) {
                books = booksRes.getOrNull() ?: emptyList()
            }
            if (metricsRes.isSuccess) {
                metrics = metricsRes.getOrNull() ?: AdminMetrics()
            }
            isLoading = false
        }
    }

    LaunchedEffect(Unit) {
        refreshData()
    }

    val filteredBooks = remember(books, searchQuery) {
        if (searchQuery.isBlank()) books
        else {
            val q = searchQuery.trim().lowercase()
            books.filter {
                it.titleBn.lowercase().contains(q) ||
                it.titleEn.lowercase().contains(q) ||
                it.authorBn.lowercase().contains(q) ||
                it.categoryBn.lowercase().contains(q)
            }
        }
    }

    Scaffold(
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showUploadDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.White,
                icon = { Icon(Icons.Default.CloudUpload, contentDescription = "আপলোড") },
                text = { Text("বই আপলোড করুন", fontWeight = FontWeight.Bold) }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(8.dp))
                // Dashboard Header Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(42.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.AdminPanelSettings,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        "প্রশাসক নিয়ন্ত্রণ ড্যাশবোর্ড",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        ApiClient.adminEmail,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
                                    )
                                }
                            }

                            Row {
                                IconButton(onClick = { showServerConfigDialog = true }) {
                                    Icon(
                                        Icons.Default.Settings,
                                        contentDescription = "সার্ভার সেটিংস",
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                }
                                IconButton(onClick = { refreshData() }) {
                                    Icon(
                                        Icons.Default.Refresh,
                                        contentDescription = "রিফ্রেশ করুন",
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Stats Grid (4 Cards)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            MetricBox(
                                title = "মোট বই",
                                value = "${books.size}",
                                icon = Icons.Default.MenuBook,
                                color = Color(0xFF3B82F6L),
                                modifier = Modifier.weight(1f)
                            )
                            MetricBox(
                                title = "প্রকাশিত",
                                value = "${books.count { it.isPublished }}",
                                icon = Icons.Default.CheckCircle,
                                color = Color(0xFF10B981L),
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            MetricBox(
                                title = "খসড়া (Draft)",
                                value = "${books.count { !it.isPublished }}",
                                icon = Icons.Default.EditNote,
                                color = Color(0xFFF59E0BL),
                                modifier = Modifier.weight(1f)
                            )
                            MetricBox(
                                title = "মোট আয়",
                                value = "৳${metrics.totalRevenueBDT}",
                                icon = Icons.Default.Paid,
                                color = Color(0xFFE2136EL),
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            // Upload Big Action Button Banner
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showUploadDialog = true },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(MaterialTheme.colorScheme.primary),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Default.Add,
                                    contentDescription = null,
                                    tint = Color.White
                                )
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column {
                                Text(
                                    "নতুন বই আপলোড করুন",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                                Text(
                                    "PDF ফাইল, বিবরণ ও মূল্য সহ সরাসরি ডাটাবেজে যুক্ত করুন",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                                )
                            }
                        }
                        Icon(
                            Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
            }

            // Books Header & Search Bar
            item {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "আপলোডকৃত বইসমূহ (${filteredBooks.size})",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("বইয়ের নাম বা লেখক দিয়ে খুঁজুন...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(onClick = { searchQuery = "" }) {
                                    Icon(Icons.Default.Clear, contentDescription = "মুছুন")
                                }
                            }
                        },
                        shape = RoundedCornerShape(14.dp),
                        singleLine = true
                    )
                }
            }

            // Books List
            if (isLoading) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    }
                }
            } else if (filteredBooks.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                Icons.Default.MenuBook,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                if (searchQuery.isBlank()) "এখনো কোনো বই আপলোড করা হয়নি"
                                else "কোনো বই খুঁজে পাওয়া যায়নি",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            } else {
                items(filteredBooks, key = { it.id }) { book ->
                    AdminBookItemCard(
                        book = book,
                        onEdit = { bookToEdit = book },
                        onDelete = { bookToDelete = book }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }

    // Upload Book Dialog
    if (showUploadDialog) {
        BookUploadDialog(
            onDismiss = { showUploadDialog = false },
            onBookUploaded = { payload ->
                coroutineScope.launch {
                    val result = BookRepository.uploadBook(payload)
                    if (result.isSuccess) {
                        Toast.makeText(context, "বই সফলভাবে আপলোড ও সংরক্ষিত হয়েছে!", Toast.LENGTH_SHORT).show()
                        showUploadDialog = false
                        refreshData()
                    } else {
                        Toast.makeText(context, "আপলোড ব্যর্থ হয়েছে", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        )
    }

    // Edit Book Dialog
    bookToEdit?.let { book ->
        BookEditDialog(
            book = book,
            onDismiss = { bookToEdit = null },
            onSave = { payload ->
                coroutineScope.launch {
                    val result = BookRepository.updateBook(book.id, payload)
                    if (result.isSuccess) {
                        Toast.makeText(context, "বইয়ের তথ্য সফলভাবে হালনাগাদ করা হয়েছে!", Toast.LENGTH_SHORT).show()
                        bookToEdit = null
                        refreshData()
                    } else {
                        Toast.makeText(context, "হালনাগাদ ব্যর্থ হয়েছে", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        )
    }

    // Delete Confirmation Dialog
    bookToDelete?.let { book ->
        AlertDialog(
            onDismissRequest = { bookToDelete = null },
            icon = { Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
            title = { Text("বই মুছে ফেলা নিশ্চিতকরণ") },
            text = { Text("আপনি কি নিশ্চিত যে \"${book.titleBn}\" বইটি সম্পূর্ণ মুছে ফেলতে চান? এটি ডাটাবেজ থেকে মুছে যাবে।") },
            confirmButton = {
                Button(
                    onClick = {
                        coroutineScope.launch {
                            val result = BookRepository.deleteBook(book.id)
                            if (result.isSuccess) {
                                Toast.makeText(context, "বইটি মুছে ফেলা হয়েছে।", Toast.LENGTH_SHORT).show()
                                bookToDelete = null
                                refreshData()
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("হ্যাঁ, মুছে ফেলুন")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { bookToDelete = null }) {
                    Text("বাতিল")
                }
            }
        )
    }

    // Server Config Dialog
    if (showServerConfigDialog) {
        var serverUrlInput by remember { mutableStateOf(ApiClient.getBaseUrl()) }
        AlertDialog(
            onDismissRequest = { showServerConfigDialog = false },
            icon = { Icon(Icons.Default.Dns, contentDescription = null) },
            title = { Text("সার্ভার সংযোগ কনফিগারেশন") },
            text = {
                Column {
                    Text(
                        "ব্যাকএন্ড সার্ভার URL নির্ধারণ করুন (যেমন এমুলেটরে http://10.0.2.2:3000/ বা আপনার কম্পিউটারের লোকাল IP http://192.168.x.x:3000/):",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = serverUrlInput,
                        onValueChange = { serverUrlInput = it },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    ApiClient.setBaseUrl(serverUrlInput)
                    showServerConfigDialog = false
                    refreshData()
                    Toast.makeText(context, "সার্ভার URL হালনাগাদ হয়েছে", Toast.LENGTH_SHORT).show()
                }) {
                    Text("সংরক্ষণ করুন")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showServerConfigDialog = false }) {
                    Text("বাতিল")
                }
            }
        )
    }
}

@Composable
fun MetricBox(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(title, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun AdminBookItemCard(
    book: Book,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Book Icon / Cover placeholder
            Box(
                modifier = Modifier
                    .size(54.dp, 72.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.MenuBook,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            // Book Details
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = book.titleBn,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = "লেখক: ${book.authorBn}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1
                )

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Category Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            book.categoryBn,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Price Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.primaryContainer)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            "৳${book.priceBDT}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }

                    // Publish State Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                if (book.isPublished) Color(0xFF10B981L).copy(alpha = 0.15f)
                                else Color(0xFFF59E0BL).copy(alpha = 0.15f)
                            )
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            if (book.isPublished) "প্রকাশিত" else "খসড়া",
                            style = MaterialTheme.typography.labelSmall,
                            color = if (book.isPublished) Color(0xFF10B981L) else Color(0xFFF59E0BL),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // Action Buttons (Edit & Delete)
            Row {
                IconButton(onClick = onEdit) {
                    Icon(
                        Icons.Default.Edit,
                        contentDescription = "সম্পাদনা করুন",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
                IconButton(onClick = onDelete) {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = "মুছে ফেলুন",
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookUploadDialog(
    onDismiss: () -> Unit,
    onBookUploaded: (CreateBookPayload) -> Unit
) {
    val context = LocalContext.current

    var titleBn by remember { mutableStateOf("") }
    var titleEn by remember { mutableStateOf("") }
    var authorBn by remember { mutableStateOf("") }
    var authorEn by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Novel") }
    var categoryBn by remember { mutableStateOf("উপন্যাস") }
    var descriptionBn by remember { mutableStateOf("") }
    var priceBDT by remember { mutableStateOf("150") }
    var coverImage by remember { mutableStateOf("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80") }

    // PDF state
    var selectedPdfUri by remember { mutableStateOf<Uri?>(null) }
    var selectedPdfFileName by remember { mutableStateOf("") }
    var selectedPdfFileSize by remember { mutableStateOf("") }
    var selectedPdfBase64 by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    val pdfPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            selectedPdfUri = uri
            val (name, size) = getFileNameAndSize(context, uri)
            selectedPdfFileName = name
            selectedPdfFileSize = formatFileSize(size)
            val base64Data = readUriToBase64(context, uri)
            if (base64Data != null) {
                selectedPdfBase64 = base64Data
            }
        }
    }

    val categories = listOf(
        Pair("Novel", "উপন্যাস"),
        Pair("Poetry", "কবিতা"),
        Pair("Story", "ছোটগল্প"),
        Pair("Islamic", "ইসলামিক বই"),
        Pair("History", "ইতিহাস"),
        Pair("Technology", "প্রযুক্তি"),
        Pair("General", "সাধারণ")
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.92f),
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.CloudUpload,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            "নতুন বই আপলোড করুন",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "বন্ধ করুন")
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                // Scrollable Form Fields
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    if (errorMessage.isNotBlank()) {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(errorMessage, color = MaterialTheme.colorScheme.onErrorContainer, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }

                    // 1. PDF File Picker Section (Prominently placed at top)
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = if (selectedPdfFileName.isNotBlank())
                                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                            else MaterialTheme.colorScheme.surfaceVariant
                        ),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.PictureAsPdf,
                                    contentDescription = null,
                                    tint = if (selectedPdfFileName.isNotBlank()) MaterialTheme.colorScheme.primary else Color.Gray,
                                    modifier = Modifier.size(28.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        "পিডিএফ ফাইল (PDF Document)",
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        if (selectedPdfFileName.isNotBlank()) "$selectedPdfFileName ($selectedPdfFileSize)"
                                        else "কোনো ফাইল নির্বাচিত হয়নি",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { pdfPickerLauncher.launch("application/pdf") },
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                                ) {
                                    Icon(Icons.Default.UploadFile, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(if (selectedPdfFileName.isBlank()) "PDF নির্বাচন করুন" else "PDF পরিবর্তন করুন")
                                }

                                if (selectedPdfFileName.isNotBlank()) {
                                    OutlinedButton(onClick = {
                                        selectedPdfUri = null
                                        selectedPdfFileName = ""
                                        selectedPdfFileSize = ""
                                        selectedPdfBase64 = ""
                                    }) {
                                        Text("মুছুন")
                                    }
                                }
                            }
                        }
                    }

                    // 2. Book Title (Bengali)
                    OutlinedTextField(
                        value = titleBn,
                        onValueChange = { titleBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বইয়ের নাম (বাংলা) *") },
                        placeholder = { Text("যেমন: সঞ্চয়িতা, হিমু ইত্যাদি") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 3. Book Title (English)
                    OutlinedTextField(
                        value = titleEn,
                        onValueChange = { titleEn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বইয়ের নাম (English - ঐচ্ছিক)") },
                        placeholder = { Text("e.g. Sanchayita") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 4. Author (Bengali)
                    OutlinedTextField(
                        value = authorBn,
                        onValueChange = { authorBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("লেখকের নাম (বাংলা) *") },
                        placeholder = { Text("যেমন: রবীন্দ্রনাথ ঠাকুর, হুমায়ূন আহমেদ") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 5. Author (English)
                    OutlinedTextField(
                        value = authorEn,
                        onValueChange = { authorEn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("লেখকের নাম (English - ঐচ্ছিক)") },
                        placeholder = { Text("e.g. Rabindranath Tagore") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 6. Category Selection
                    Text("ক্যাটাগরি নির্ধারণ করুন *", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        categories.forEach { (catEn, catBn) ->
                            val isSelected = category == catEn
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    category = catEn
                                    categoryBn = catBn
                                },
                                label = { Text(catBn) },
                                leadingIcon = if (isSelected) {
                                    { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                } else null
                            )
                        }
                    }

                    // 7. Price in BDT
                    OutlinedTextField(
                        value = priceBDT,
                        onValueChange = { priceBDT = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বিক্রয় মূল্য (BDT / টাকা) *") },
                        placeholder = { Text("যেমন: 150") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        leadingIcon = { Text("৳", fontWeight = FontWeight.Bold, modifier = Modifier.padding(start = 12.dp)) },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 8. Description (Bengali)
                    OutlinedTextField(
                        value = descriptionBn,
                        onValueChange = { descriptionBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বইয়ের সংক্ষিপ্ত বিবরণ ও সূচিপত্র *") },
                        placeholder = { Text("বইটির পটভূমি, সারসংক্ষেপ ও গুরুত্বপূর্ণ অধ্যায়সমূহ লিখুন...") },
                        minLines = 3,
                        maxLines = 6,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // 9. Cover Image URL
                    OutlinedTextField(
                        value = coverImage,
                        onValueChange = { coverImage = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("কভার ছবির লিংক (Image URL - ঐচ্ছিক)") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                // Actions: Publish Now or Save Draft
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("বাতিল")
                    }

                    Button(
                        onClick = {
                            if (titleBn.isBlank() || authorBn.isBlank() || priceBDT.isBlank()) {
                                errorMessage = "বইয়ের নাম, লেখক এবং মূল্য পূরণ করা আবশ্যক।"
                                return@Button
                            }
                            val price = priceBDT.toIntOrNull()
                            if (price == null || price < 0) {
                                errorMessage = "সঠিক বিক্রয় মূল্য সংখ্যায় লিখুন।"
                                return@Button
                            }
                            isSubmitting = true
                            val payload = CreateBookPayload(
                                titleBn = titleBn.trim(),
                                titleEn = titleEn.trim().ifBlank { titleBn.trim() },
                                authorBn = authorBn.trim(),
                                authorEn = authorEn.trim().ifBlank { authorBn.trim() },
                                category = category,
                                categoryBn = categoryBn,
                                descriptionBn = descriptionBn.trim().ifBlank { "বইয়ের বিবরণ এখনো যুক্ত করা হয়নি।" },
                                priceBDT = price,
                                coverImage = coverImage.trim(),
                                pdfFileName = selectedPdfFileName,
                                pdfDataBuffer = selectedPdfBase64,
                                isPublished = true
                            )
                            onBookUploaded(payload)
                        },
                        modifier = Modifier.weight(2f),
                        enabled = !isSubmitting,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        if (isSubmitting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                        }
                        Text("সংরক্ষণ ও প্রকাশ করুন", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookEditDialog(
    book: Book,
    onDismiss: () -> Unit,
    onSave: (CreateBookPayload) -> Unit
) {
    var titleBn by remember { mutableStateOf(book.titleBn) }
    var titleEn by remember { mutableStateOf(book.titleEn) }
    var authorBn by remember { mutableStateOf(book.authorBn) }
    var authorEn by remember { mutableStateOf(book.authorEn) }
    var category by remember { mutableStateOf(book.category) }
    var categoryBn by remember { mutableStateOf(book.categoryBn) }
    var descriptionBn by remember { mutableStateOf(book.descriptionBn) }
    var priceBDT by remember { mutableStateOf(book.priceBDT.toString()) }
    var isPublished by remember { mutableStateOf(book.isPublished) }
    var errorMessage by remember { mutableStateOf("") }

    val categories = listOf(
        Pair("Novel", "উপন্যাস"),
        Pair("Poetry", "কবিতা"),
        Pair("Story", "ছোটগল্প"),
        Pair("Islamic", "ইসলামিক বই"),
        Pair("History", "ইতিহাস"),
        Pair("Technology", "প্রযুক্তি"),
        Pair("General", "সাধারণ")
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.88f),
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "বই সম্পাদনা করুন",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "বন্ধ করুন")
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    if (errorMessage.isNotBlank()) {
                        Text(errorMessage, color = MaterialTheme.colorScheme.error)
                    }

                    OutlinedTextField(
                        value = titleBn,
                        onValueChange = { titleBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বইয়ের নাম (বাংলা)") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedTextField(
                        value = authorBn,
                        onValueChange = { authorBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("লেখক (বাংলা)") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Text("ক্যাটাগরি", style = MaterialTheme.typography.titleSmall)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        categories.forEach { (catEn, catBn) ->
                            val isSelected = category == catEn
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    category = catEn
                                    categoryBn = catBn
                                },
                                label = { Text(catBn) }
                            )
                        }
                    }

                    OutlinedTextField(
                        value = priceBDT,
                        onValueChange = { priceBDT = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("মূল্য (টাকা)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedTextField(
                        value = descriptionBn,
                        onValueChange = { descriptionBn = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("বিবরণ") },
                        minLines = 3,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = isPublished,
                            onCheckedChange = { isPublished = it }
                        )
                        Text("অ্যাপে সবার জন্য প্রকাশিত রাখুন (Published)")
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("বাতিল")
                    }

                    Button(
                        onClick = {
                            if (titleBn.isBlank() || authorBn.isBlank() || priceBDT.isBlank()) {
                                errorMessage = "শিরোনাম, লেখক ও মূল্য আবশ্যক।"
                                return@Button
                            }
                            val price = priceBDT.toIntOrNull() ?: book.priceBDT
                            val payload = CreateBookPayload(
                                titleBn = titleBn.trim(),
                                titleEn = titleEn.trim().ifBlank { titleBn.trim() },
                                authorBn = authorBn.trim(),
                                authorEn = authorEn.trim().ifBlank { authorBn.trim() },
                                category = category,
                                categoryBn = categoryBn,
                                descriptionBn = descriptionBn.trim(),
                                priceBDT = price,
                                coverImage = book.coverImage,
                                isPublished = isPublished
                            )
                            onSave(payload)
                        },
                        modifier = Modifier.weight(2f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("পরিবর্তন সংরক্ষণ করুন")
                    }
                }
            }
        }
    }
}

// Helpers for Android PDF Uri resolution
fun getFileNameAndSize(context: Context, uri: Uri): Pair<String, Long> {
    var name = "selected_document.pdf"
    var size = 0L
    try {
        val cursor = context.contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                if (nameIndex != -1) {
                    val str = it.getString(nameIndex)
                    if (!str.isNullOrBlank()) name = str
                }
                if (sizeIndex != -1) {
                    size = it.getLong(sizeIndex)
                }
            }
        }
    } catch (e: Exception) {}
    return Pair(name, size)
}

fun formatFileSize(bytes: Long): String {
    if (bytes <= 0) return "0 KB"
    val kb = bytes / 1024.0
    val mb = kb / 1024.0
    return if (mb >= 1.0) {
        String.format(java.util.Locale.US, "%.2f MB", mb)
    } else {
        String.format(java.util.Locale.US, "%.1f KB", kb)
    }
}

fun readUriToBase64(context: Context, uri: Uri): String? {
    return try {
        context.contentResolver.openInputStream(uri)?.use { stream ->
            val bytes = stream.readBytes()
            Base64.encodeToString(bytes, Base64.NO_WRAP)
        }
    } catch (e: Exception) {
        null
    }
}
