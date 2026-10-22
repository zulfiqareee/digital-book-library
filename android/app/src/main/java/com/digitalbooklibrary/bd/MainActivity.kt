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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.*

sealed class Screen(val route: String, val titleBn: String, val icon: ImageVector) {
    object Home : Screen("home", "হোম", Icons.Default.Home)
    object Books : Screen("books", "বইসমূহ", Icons.Default.MenuBook)
    object Search : Screen("search", "অনুসন্ধান", Icons.Default.Search)
    object Library : Screen("library", "লাইব্রেরি", Icons.Default.CollectionsBookmark)
    object Admin : Screen("admin", "অ্যাডমিন", Icons.Default.AdminPanelSettings)
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
                title = { Text("ডিজিটাল বই লাইব্রেরি", style = MaterialTheme.typography.titleLarge) },
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
                                popUpTo(navController.graph.startDestinationId)
                                launchSingleTop = true
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
                // Compose HomeScreen with featured books, categories, and free reader
            }
            composable(Screen.Books.route) {
                // Compose AllBooksScreen with search and filter
            }
            composable(Screen.Search.route) {
                // Search Screen
            }
            composable(Screen.Library.route) {
                // User Library & Downloaded PDFs
            }
            composable(Screen.Admin.route) {
                // Admin Dashboard & Book Upload
            }
        }
    }
}

@Composable
fun DigitalBookLibraryTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = androidx.compose.ui.graphics.Color(0xFFE2136E), // bKash brand pink
            primaryContainer = androidx.compose.ui.graphics.Color(0xFF3B0B1E),
            secondary = androidx.compose.ui.graphics.Color(0xFF0F766E),
            background = androidx.compose.ui.graphics.Color(0xFF0F172A),
            surface = androidx.compose.ui.graphics.Color(0xFF1E293B)
        ),
        content = content
    )
}
