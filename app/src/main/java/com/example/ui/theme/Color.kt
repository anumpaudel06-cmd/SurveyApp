package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// Minimal Dark & Green Design System (No Neon, Professional & Attractive)
val DarkBackground = Color(0xFF0C100D)       // Deep matte obsidian
val DarkSurface = Color(0xFF131A15)          // Primary card surface
val DarkSurfaceElevated = Color(0xFF18221B)  // Elevated container / hover
val DarkSurfaceHighlight = Color(0xFF1E2B22) // Subtle active surface
val DarkSurfaceRowAlt = Color(0xFF151E17)    // Alternating row surface

// Rich Natural Green Accents (Balanced, Readable, No Neon)
val GreenPrimary = Color(0xFF10B981)         // Emerald green (Primary action)
val GreenPrimaryDark = Color(0xFF059669)     // Forest emerald (Pressed / containers)
val GreenAccent = Color(0xFF34D399)          // Mint green (Calculated results / highlights)
val GreenContainer = Color(0xFF142C1D)       // Dark forest container
val GreenContainerBorder = Color(0xFF20482E) // Green container border
val GreenSoft = Color(0xFF6EE7B7)            // Soft sage for badges & labels
val GreenPale = Color(0xFFA7F3D0)            // High contrast pale sage

// Dark Green Borders & Dividers
val DarkBorder = Color(0xFF1E2B21)           // Subtle dark border
val DarkBorderSubtle = Color(0xFF18231B)     // Faint card border
val DarkBorderHighlight = Color(0xFF2B3F30)  // Active/focused border

// Typography Colors
val TextPrimary = Color(0xFFF3FBF5)          // Crisp off-white / pale mint
val TextSecondary = Color(0xFF98A79B)        // Muted sage text
val TextMuted = Color(0xFF5E7163)            // Subdued hint / placeholder text

// Functional Muted Dark Button / Status Colors
val DarkButtonNeutral = Color(0xFF1A241D)
val DarkButtonDanger = Color(0xFF2C1E1E)
val TextDangerMuted = Color(0xFFE57373)

// Aliases for compatibility mapped to dark & green system
val Slate900 = DarkBackground
val Slate800 = DarkSurface
val Slate700 = DarkSurfaceElevated
val Slate600 = TextSecondary
val Slate200 = DarkBorder
val Slate100 = DarkSurfaceHighlight
val Slate50 = TextPrimary

val PrimaryBlue = GreenPrimary
val PrimaryBlueDark = GreenPrimaryDark
val PrimaryBlueLight = GreenSoft

val AmberSurvey = GreenAccent
val AmberLight = GreenContainer

val EmeraldCadastral = GreenPrimary
val EmeraldLight = GreenSoft

// Mapped from old red to new clean Mint green (No Neon)
val ResultRed = GreenAccent
val ResultRedDark = GreenPrimaryDark
val ResultRedLight = GreenContainer


