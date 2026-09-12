package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Minimal, elegant Dark & Green Color Scheme (No neon, pure dark & forest/emerald)
private val MinimalDarkGreenColorScheme = darkColorScheme(
    primary = GreenPrimary,
    onPrimary = DarkBackground,
    primaryContainer = GreenContainer,
    onPrimaryContainer = GreenPale,
    secondary = GreenAccent,
    onSecondary = DarkBackground,
    secondaryContainer = DarkSurfaceElevated,
    onSecondaryContainer = GreenSoft,
    tertiary = GreenSoft,
    onTertiary = DarkBackground,
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceElevated,
    onSurfaceVariant = TextSecondary,
    outline = DarkBorder,
    outlineVariant = DarkBorderHighlight
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    // Explicit user requirement: "only dark and green"
    MaterialTheme(
        colorScheme = MinimalDarkGreenColorScheme,
        typography = Typography,
        content = content
    )
}

