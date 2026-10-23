package com.digitalbooklibrary.bd

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBox
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.digitalbooklibrary.bd.model.Book
import com.digitalbooklibrary.bd.repository.BookRepository
import com.digitalbooklibrary.bd.ui.admin.AdminDashboardScreen
import kotlinx.coroutines.launch

sealed class Screen(val route: String, val titleBn: String, val icon: ImageVector) {
    data object Home : Screen("home", "হোম", Icons.Default.Home)
    data object Books : Screen("books", "বইসমূহ", Icons.Default.Menu)
    data object Search : Screen("search", "অনুসন্ধান", Icons.Default.Search)
    data object Library : Screen("library", "লাইব্রেরি", Icons.Default.Favorite)
    data object Admin : Screen("admin", "অ্যাডমিন", Icons.Default.AccountBox)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DigitalBookLibraryTheme {
                MainAppNavHost()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text("ডিজিটাল বই লাইব্রেরি", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                actions = {
                    IconButton(onClick = { navController.navigate(Screen.Search.route) }) {
                        Icon(Icons.Default.Search, contentDescription = "অনুসন্ধান")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                val items = listOf(
                    Screen.Home,
                    Screen.Books,
                    Screen.Library,
                    Screen.Admin
                )
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.titleBn) },
                        label = { Text(screen.titleBn) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(Screen.Home.route) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreenView(onNavigateToBooks = { navController.navigate(Screen.Books.route) })
            }
            composable(Screen.Books.route) {
                BooksScreenView()
            }
            composable(Screen.Search.route) {
                SearchScreenView()
            }
            composable(Screen.Library.route) {
                LibraryScreenView()
            }
            composable(Screen.Admin.route) {
                AdminDashboardScreen()
            }
        }
    }
}

@Composable
fun HomeScreenView(onNavigateToBooks: () -> Unit) {
    var books by remember { mutableStateOf<List<Book>>(emptyList()) }
    LaunchedEffect(Unit) {
        val res = BookRepository.getBooks()
        if (res.isSuccess) {
            books = res.getOrNull()?.filter { it.isPublished } ?: emptyList()
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(18.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        "স্বাগতম ডিজিটাল বই লাইব্রেরি বাংলাদেশে!",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "অনলাইনে বিনামূল্যে বই পড়ুন, আর উচ্চমানের পিডিএফ কপি সংগ্রহ করুন খুব সহজেই বিকাশ পেমেন্টে।",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Button(
                        onClick = onNavigateToBooks,
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Text("সকল বই দেখুন", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item {
            Text("জনপ্রিয় প্রকাশিত বইসমূহ", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }

        items(books) { book ->
            PublicBookCard(book = book)
        }
    }
}

@Composable
fun BooksScreenView() {
    var books by remember { mutableStateOf<List<Book>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        val res = BookRepository.getBooks()
        if (res.isSuccess) {
            books = res.getOrNull()?.filter { it.isPublished } ?: emptyList()
        }
        isLoading = false
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("সকল প্রকাশিত বইসমূহ", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        } else if (books.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("কোনো প্রকাশিত বই পাওয়া যায়নি।", style = MaterialTheme.typography.bodyLarge)
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(books) { book ->
                    PublicBookCard(book = book)
                }
            }
        }
    }
}

@Composable
fun SearchScreenView() {
    var query by remember { mutableStateOf("") }
    var allBooks by remember { mutableStateOf<List<Book>>(emptyList()) }

    LaunchedEffect(Unit) {
        val res = BookRepository.getBooks()
        if (res.isSuccess) {
            allBooks = res.getOrNull()?.filter { it.isPublished } ?: emptyList()
        }
    }

    val results = remember(query, allBooks) {
        if (query.isBlank()) emptyList()
        else {
            val q = query.trim().lowercase()
            allBooks.filter {
                it.titleBn.lowercase().contains(q) ||
                it.authorBn.lowercase().contains(q) ||
                it.categoryBn.lowercase().contains(q)
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("বই অনুসন্ধান করুন", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("বইয়ের নাম, লেখক বা ক্যাটাগরি লিখুন...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "মুছুন")
                    }
                }
            },
            shape = RoundedCornerShape(12.dp),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (query.isBlank()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("বই খুঁজতে উপরে লিখুন...", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else if (results.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("\"$query\" সম্পর্কিত কোনো বই পাওয়া যায়নি", style = MaterialTheme.typography.bodyLarge)
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(results) { book ->
                    PublicBookCard(book = book)
                }
            }
        }
    }
}

@Composable
fun LibraryScreenView() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Favorite,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(32.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("আমার ব্যক্তিগত লাইব্রেরি", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "আপনার বিকাশ পেমেন্ট সম্পন্ন হলে ক্রয়কৃত বই এবং ডাউনলোডযোগ্য পিডিএফ এখানে সংরক্ষিত থাকবে।",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun PublicBookCard(book: Book) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(14.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(50.dp, 68.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.MenuBook, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(book.titleBn, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text("লেখক: ${book.authorBn}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.height(4.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(book.categoryBn, style = MaterialTheme.typography.labelSmall)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.primaryContainer)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("৳${book.priceBDT}", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun DigitalBookLibraryTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFFE2136EL),
            primaryContainer = Color(0xFF3B0B1EL),
            secondary = Color(0xFF0F766EL),
            background = Color(0xFF0F172AL),
            surface = Color(0xFF1E293BL),
            surfaceVariant = Color(0xFF334155L)
        ),
        content = content
    )
}
