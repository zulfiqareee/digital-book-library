package com.digitalbooklibrary.bd

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController

sealed class Screen(val route: String, val titleBn: String, val icon: ImageVector) {
    object Home : Screen("home", "হোম", Icons.Default.Home)
    object Books : Screen("books", "বইসমূহ", Icons.Default.List)
    object Search : Screen("search", "অনুসন্ধান", Icons.Default.Search)
    object Library : Screen("library", "লাইব্রেরি", Icons.Default.Star)
    object Admin : Screen("admin", "অ্যাডমিন", Icons.Default.Person)
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
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("স্বাগতম ডিজিটাল বই লাইব্রেরি বাংলাদেশে!", style = MaterialTheme.typography.bodyLarge)
                }
            }
            composable(Screen.Books.route) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("সকল প্রকাশিত বইসমূহ", style = MaterialTheme.typography.bodyLarge)
                }
            }
            composable(Screen.Search.route) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("বই অনুসন্ধান করুন", style = MaterialTheme.typography.bodyLarge)
                }
            }
            composable(Screen.Library.route) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("আমার ব্যক্তিগত লাইব্রেরি", style = MaterialTheme.typography.bodyLarge)
                }
            }
            composable(Screen.Admin.route) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("প্রশাসক নিয়ন্ত্রণ কেন্দ্র", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }
    }
}

@Composable
fun DigitalBookLibraryTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = androidx.compose.ui.graphics.Color(0xFFE2136E),
            primaryContainer = androidx.compose.ui.graphics.Color(0xFF3B0B1E),
            secondary = androidx.compose.ui.graphics.Color(0xFF0F766E),
            background = androidx.compose.ui.graphics.Color(0xFF0F172A),
            surface = androidx.compose.ui.graphics.Color(0xFF1E293B)
        ),
        content = content
    )
}
