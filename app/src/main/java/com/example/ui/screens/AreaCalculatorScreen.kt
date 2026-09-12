package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material.icons.filled.TouchApp
import androidx.compose.material.icons.filled.Undo
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SurveyConstants
import com.example.model.AreaPoint
import com.example.model.SurveyUnit
import com.example.service.AreaEngine
import com.example.ui.theme.DarkBackground
import com.example.ui.theme.DarkBorder
import com.example.ui.theme.DarkBorderSubtle
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.DarkSurfaceElevated
import com.example.ui.theme.DarkSurfaceRowAlt
import com.example.ui.theme.GreenAccent
import com.example.ui.theme.GreenContainer
import com.example.ui.theme.GreenContainerBorder
import com.example.ui.theme.GreenPale
import com.example.ui.theme.GreenPrimary
import com.example.ui.theme.GreenSoft
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import java.util.Locale
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.min

@Composable
fun AreaCalculatorScreen(
    importedPoints: List<AreaPoint> = emptyList(),
    modifier: Modifier = Modifier
) {
    // List of polygon vertices
    var points by remember {
        mutableStateOf(
            if (importedPoints.isNotEmpty()) importedPoints else listOf(
                AreaPoint(label = "P1", x = 100.0, y = 100.0),
                AreaPoint(label = "P2", x = 250.0, y = 120.0),
                AreaPoint(label = "P3", x = 280.0, y = 260.0),
                AreaPoint(label = "P4", x = 120.0, y = 240.0)
            )
        )
    }

    // When importedPoints changes externally, update points
    remember(importedPoints) {
        if (importedPoints.isNotEmpty()) {
            points = importedPoints
        }
    }

    var isPolygonClosed by remember { mutableStateOf(true) }
    var activeTab by remember { mutableStateOf(0) } // 0: Interactive Canvas, 1: Coordinate Table
    var plotterUnit by remember { mutableStateOf(SurveyUnit.LENGTH_UNITS[0]) } // 0: Meter (m), 1: Feet (ft)
    var canvasMode by remember { mutableStateOf(0) } // 0: Add Pins, 1: Touch 2 Pins to Set Distance
    var selectedPointIndex1 by remember { mutableStateOf<Int?>(null) }
    var selectedPointIndex2 by remember { mutableStateOf<Int?>(null) }
    var showSetDistanceDialog by remember { mutableStateOf(false) }
    var enteredDistanceText by remember { mutableStateOf("") }
    var scaleWholePolygon by remember { mutableStateOf(false) }
    var showAddPointDialog by remember { mutableStateOf(false) }
    var editingPointIndex by remember { mutableStateOf<Int?>(null) }

    // Dynamic high-precision Shoelace Area computation
    val areaResult by remember(points, plotterUnit) {
        derivedStateOf {
            if (plotterUnit.id == "ft") {
                val rawShoelace = AreaEngine.calculatePolygonArea(points)
                val sqFt = rawShoelace.sqMeters // raw calculation on feet coordinates gives sq.ft
                val perimFt = rawShoelace.perimeterMeters
                val sqM = sqFt * SurveyConstants.SQFT_TO_SQM
                val base = AreaEngine.fromSqMeters(sqM)
                base.copy(
                    sqFeet = sqFt,
                    perimeterMeters = perimFt * SurveyConstants.FEET_TO_METERS
                )
            } else {
                AreaEngine.calculatePolygonArea(points)
            }
        }
    }

    val verticalScroll = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .verticalScroll(verticalScroll)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "Area Calculator & Plotter",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Shoelace polygon computation & 2D interactive cadastral canvas",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
        }

        // ==========================================
        // PLOTTER UNIT SELECTOR (Standard Conversions)
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(DarkSurface, RoundedCornerShape(10.dp))
                .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(10.dp))
                .padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Plotter Coordinate Unit",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary
                )
                Text(
                    text = if (plotterUnit.id == "m") "Standard Meters (m)" else "Imperial Feet (ft)",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Bold,
                    color = GreenAccent
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val isMeter = plotterUnit.id == "m"
                Button(
                    onClick = {
                        if (plotterUnit.id != "m") {
                            // Convert existing coordinates smoothly from feet to meters using standard factor
                            val factor = SurveyConstants.FEET_TO_METERS
                            points = points.map { it.copy(x = it.x * factor, y = it.y * factor) }
                            plotterUnit = SurveyUnit.LENGTH_UNITS[0]
                        }
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isMeter) GreenPrimary else Color(0xFF000000),
                        contentColor = if (isMeter) DarkBackground else TextSecondary
                    ),
                    border = BorderStroke(1.dp, if (isMeter) GreenPrimary else DarkBorder),
                    modifier = Modifier.height(36.dp)
                ) {
                    Text(
                        text = "Meters (m)",
                        fontSize = 12.sp,
                        fontWeight = if (isMeter) FontWeight.Bold else FontWeight.Normal
                    )
                }

                val isFeet = plotterUnit.id == "ft"
                Button(
                    onClick = {
                        if (plotterUnit.id != "ft") {
                            // Convert existing coordinates smoothly from meters to feet using standard factor
                            val factor = SurveyConstants.METERS_TO_FEET
                            points = points.map { it.copy(x = it.x * factor, y = it.y * factor) }
                            plotterUnit = SurveyUnit.LENGTH_UNITS[1]
                        }
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isFeet) GreenPrimary else Color(0xFF000000),
                        contentColor = if (isFeet) DarkBackground else TextSecondary
                    ),
                    border = BorderStroke(1.dp, if (isFeet) GreenPrimary else DarkBorder),
                    modifier = Modifier.height(36.dp)
                ) {
                    Text(
                        text = "Feet (ft)",
                        fontSize = 12.sp,
                        fontWeight = if (isFeet) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }

        // ==========================================
        // DYNAMIC OUTPUT AREA BANNER (All Systems)
        // ==========================================
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("dynamic_area_output_card"),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, GreenContainerBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            text = "TOTAL ENCLOSED AREA",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = GreenSoft,
                            letterSpacing = 1.1.sp
                        )
                        val primaryAreaFormatted = if (plotterUnit.id == "ft") {
                            String.format(Locale.US, "%,.2f sq.ft", areaResult.sqFeet)
                        } else {
                            String.format(Locale.US, "%,.2f sq.m", areaResult.sqMeters)
                        }
                        Text(
                            text = primaryAreaFormatted,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = GreenAccent,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Surface(
                        color = GreenContainer,
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, GreenContainerBorder)
                    ) {
                        Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)) {
                            Text(
                                text = "Perimeter",
                                style = MaterialTheme.typography.labelSmall,
                                color = GreenPale
                            )
                            val perimDisplay = if (plotterUnit.id == "ft") {
                                String.format(Locale.US, "%.2f ft", areaResult.perimeterMeters * SurveyConstants.METERS_TO_FEET)
                            } else {
                                String.format(Locale.US, "%.2f m", areaResult.perimeterMeters)
                            }
                            Text(
                                text = perimDisplay,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = GreenAccent,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                HorizontalDivider(color = DarkBorder)

                // Multi-System Breakdown Grid
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Ropani System Breakdown
                    SystemResultBox(
                        title = "Ropani System (Hilly)",
                        primary = areaResult.rapdFormatted,
                        secondary = String.format(Locale.US, "%.4f Ropani", areaResult.decimalRopani),
                        modifier = Modifier.weight(1f)
                    )
                    // Bigha System Breakdown
                    SystemResultBox(
                        title = "Bigha System (Terai)",
                        primary = areaResult.bkdFormatted,
                        secondary = String.format(Locale.US, "%.4f Bigha", areaResult.decimalBigha),
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    SystemResultBox(
                        title = "Imperial Footprint",
                        primary = String.format(Locale.US, "%,.2f sq.ft", areaResult.sqFeet),
                        secondary = String.format(Locale.US, "%.4f Acres", areaResult.acres),
                        modifier = Modifier.weight(1f)
                    )
                    SystemResultBox(
                        title = "Metric Footprint",
                        primary = String.format(Locale.US, "%,.2f sq.m", areaResult.sqMeters),
                        secondary = String.format(Locale.US, "%.4f Hectares", areaResult.hectares),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Mode Navigation: Interactive Canvas vs Manual Coordinate Entry
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            val isCanvasSelected = activeTab == 0
            Button(
                onClick = { activeTab = 0 },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isCanvasSelected) GreenPrimary else Color(0xFF000000),
                    contentColor = if (isCanvasSelected) DarkBackground else TextSecondary
                ),
                border = BorderStroke(1.dp, if (isCanvasSelected) GreenPrimary else DarkBorder),
                modifier = Modifier
                    .weight(1f)
                    .height(42.dp)
                    .testTag("tab_canvas_chip")
            ) {
                Icon(Icons.Default.TouchApp, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    "Interactive Canvas",
                    fontSize = 12.sp,
                    fontWeight = if (isCanvasSelected) FontWeight.Bold else FontWeight.Normal
                )
            }

            val isTableSelected = activeTab == 1
            Button(
                onClick = { activeTab = 1 },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isTableSelected) GreenPrimary else Color(0xFF000000),
                    contentColor = if (isTableSelected) DarkBackground else TextSecondary
                ),
                border = BorderStroke(1.dp, if (isTableSelected) GreenPrimary else DarkBorder),
                modifier = Modifier
                    .weight(1f)
                    .height(42.dp)
                    .testTag("tab_table_chip")
            ) {
                Icon(Icons.Default.Layers, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    "Table (${points.size} pts)",
                    fontSize = 12.sp,
                    fontWeight = if (isTableSelected) FontWeight.Bold else FontWeight.Normal
                )
            }
        }

        // ==========================================
        // MODULE C: INTERACTIVE CANVAS (Tap-to-Plot)
        // Buttons: "Undo Last Point", "Clear Canvas", "Close Polygon"
        // ==========================================
        if (activeTab == 0) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Canvas Interaction Mode Selector
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val isAddMode = canvasMode == 0
                    Button(
                        onClick = {
                            canvasMode = 0
                            selectedPointIndex1 = null
                            selectedPointIndex2 = null
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isAddMode) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isAddMode) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(1.dp, if (isAddMode) GreenPrimary else DarkBorder),
                        modifier = Modifier
                            .weight(1f)
                            .height(38.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            "+ Add Pins",
                            fontSize = 12.sp,
                            fontWeight = if (isAddMode) FontWeight.Bold else FontWeight.Normal
                        )
                    }

                    val isDistanceMode = canvasMode == 1
                    Button(
                        onClick = {
                            canvasMode = 1
                            selectedPointIndex1 = null
                            selectedPointIndex2 = null
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isDistanceMode) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isDistanceMode) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(1.dp, if (isDistanceMode) GreenPrimary else DarkBorder),
                        modifier = Modifier
                            .weight(1.3f)
                            .height(38.dp)
                    ) {
                        Icon(Icons.Default.Straighten, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            "📏 Touch 2 Points (Distance)",
                            fontSize = 12.sp,
                            fontWeight = if (isDistanceMode) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }

                // Interactive Guidance Banner when a point is selected
                if (selectedPointIndex1 != null && selectedPointIndex1!! < points.size) {
                    Surface(
                        color = GreenContainer,
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, GreenPrimary),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Icon(Icons.Default.Straighten, contentDescription = null, tint = GreenPrimary, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Point 1 (${points[selectedPointIndex1!!].label}) selected. Touch 2nd point to set distance.",
                                    color = GreenPale,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                            Button(
                                onClick = {
                                    selectedPointIndex1 = null
                                    selectedPointIndex2 = null
                                },
                                shape = RoundedCornerShape(6.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF000000),
                                    contentColor = TextSecondary
                                ),
                                border = BorderStroke(1.dp, DarkBorder),
                                modifier = Modifier.height(30.dp)
                            ) {
                                Text("Clear", fontSize = 11.sp)
                            }
                        }
                    }
                }

                // Interactive Toolbar Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Button(
                        onClick = {
                            if (points.isNotEmpty()) {
                                points = points.dropLast(1)
                                selectedPointIndex1 = null
                                selectedPointIndex2 = null
                            }
                        },
                        enabled = points.isNotEmpty(),
                        modifier = Modifier
                            .weight(1f)
                            .height(38.dp)
                            .testTag("undo_last_point_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF000000),
                            contentColor = TextSecondary,
                            disabledContainerColor = Color(0xFF000000).copy(alpha = 0.5f),
                            disabledContentColor = TextMuted
                        ),
                        border = BorderStroke(1.dp, DarkBorder)
                    ) {
                        Icon(Icons.Default.Undo, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Undo", fontSize = 12.sp, maxLines = 1)
                    }

                    Button(
                        onClick = {
                            isPolygonClosed = !isPolygonClosed
                        },
                        enabled = points.size >= 3,
                        modifier = Modifier
                            .weight(1.2f)
                            .height(38.dp)
                            .testTag("close_polygon_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isPolygonClosed) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isPolygonClosed) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(1.dp, if (isPolygonClosed) GreenPrimary else DarkBorder)
                    ) {
                        Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(if (isPolygonClosed) "Closed" else "Close Poly", fontSize = 12.sp, fontWeight = if (isPolygonClosed) FontWeight.Bold else FontWeight.Normal, maxLines = 1)
                    }

                    Button(
                        onClick = {
                            points = emptyList()
                            selectedPointIndex1 = null
                            selectedPointIndex2 = null
                        },
                        enabled = points.isNotEmpty(),
                        modifier = Modifier
                            .weight(1f)
                            .height(38.dp)
                            .testTag("clear_canvas_button"),
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, DarkBorder),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF000000),
                            contentColor = TextSecondary,
                            disabledContainerColor = Color(0xFF000000).copy(alpha = 0.5f),
                            disabledContentColor = TextMuted
                        )
                    ) {
                        Icon(Icons.Default.Clear, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Clear", fontSize = 12.sp, maxLines = 1)
                    }
                }

                // 2D Interactive Drawing Canvas
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(340.dp)
                        .testTag("interactive_plotter_canvas"),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, DarkBorder),
                    colors = CardDefaults.cardColors(containerColor = DarkSurface)
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        InteractivePolygonCanvas(
                            points = points,
                            isClosed = isPolygonClosed,
                            plotterUnit = plotterUnit,
                            selectedPointIndex1 = selectedPointIndex1,
                            selectedPointIndex2 = selectedPointIndex2,
                            canvasMode = canvasMode,
                            onPointTapped = { tappedIdx ->
                                if (selectedPointIndex1 == null) {
                                    selectedPointIndex1 = tappedIdx
                                } else if (selectedPointIndex1 == tappedIdx) {
                                    // Deselect
                                    selectedPointIndex1 = null
                                } else {
                                    // Second point selected!
                                    selectedPointIndex2 = tappedIdx
                                    val pt1 = points[selectedPointIndex1!!]
                                    val pt2 = points[tappedIdx]
                                    val currentDist = hypot(pt2.x - pt1.x, pt2.y - pt1.y)
                                    enteredDistanceText = String.format(Locale.US, "%.3f", currentDist)
                                    showSetDistanceDialog = true
                                }
                            },
                            onPointAdded = { newPoint ->
                                points = points + newPoint
                            },
                            modifier = Modifier.fillMaxSize()
                        )

                        // Floating hint on canvas
                        Surface(
                            color = DarkSurfaceElevated.copy(alpha = 0.9f),
                            shape = RoundedCornerShape(6.dp),
                            border = BorderStroke(1.dp, DarkBorderSubtle),
                            modifier = Modifier
                                .align(Alignment.TopStart)
                                .padding(10.dp)
                        ) {
                            val hint = if (canvasMode == 1) {
                                "Touch 2 points to measure & set distance | Unit: ${plotterUnit.symbol}"
                            } else {
                                "Tap canvas to place pins, or tap a pin to select | Unit: ${plotterUnit.symbol}"
                            }
                            Text(
                                text = hint,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall,
                                color = GreenPale
                            )
                        }
                    }
                }
            }
        }

        // ==========================================
        // MANUAL ENTRY TABLE
        // Table to enter X/Y coordinates
        // ==========================================
        if (activeTab == 1) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Polygon Vertices (Coordinates)",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Button(
                        onClick = {
                            editingPointIndex = null
                            showAddPointDialog = true
                        },
                        modifier = Modifier
                            .height(40.dp)
                            .testTag("add_coordinate_point_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GreenPrimary,
                            contentColor = DarkBackground
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Vertex", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("coordinates_table_card"),
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, DarkBorder),
                    colors = CardDefaults.cardColors(containerColor = DarkSurface)
                ) {
                    Column {
                        // Header
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(DarkSurfaceElevated)
                                .border(BorderStroke(0.5.dp, DarkBorderSubtle))
                                .padding(vertical = 10.dp, horizontal = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("VERTEX", color = GreenPale, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                            Text("EASTING (X)", color = GreenPale, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                            Text("NORTHING (Y)", color = GreenPale, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                            Text("ACTIONS", color = GreenPale, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        }

                        if (points.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("No vertices added. Tap 'Add Vertex' or tap on the canvas.", color = TextMuted)
                            }
                        } else {
                            points.forEachIndexed { index, pt ->
                                val isEven = index % 2 == 0
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(if (isEven) Color.Transparent else DarkSurfaceRowAlt)
                                        .border(BorderStroke(0.5.dp, DarkBorderSubtle))
                                        .padding(vertical = 8.dp, horizontal = 12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = pt.label,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = GreenAccent,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Text(
                                        text = String.format(Locale.US, "%.3f", pt.x),
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontFamily = FontFamily.Monospace,
                                        color = TextPrimary,
                                        modifier = Modifier.weight(1.5f),
                                        textAlign = TextAlign.Center
                                    )
                                    Text(
                                        text = String.format(Locale.US, "%.3f", pt.y),
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontFamily = FontFamily.Monospace,
                                        color = TextPrimary,
                                        modifier = Modifier.weight(1.5f),
                                        textAlign = TextAlign.Center
                                    )
                                    Row(
                                        modifier = Modifier.weight(1f),
                                        horizontalArrangement = Arrangement.End
                                    ) {
                                        IconButton(
                                            onClick = {
                                                editingPointIndex = index
                                                showAddPointDialog = true
                                            },
                                            modifier = Modifier.size(30.dp)
                                        ) {
                                            Icon(Icons.Default.Edit, contentDescription = "Edit", tint = GreenSoft, modifier = Modifier.size(15.dp))
                                        }
                                        IconButton(
                                            onClick = {
                                                points = points.filterIndexed { i, _ -> i != index }
                                            },
                                            modifier = Modifier.size(30.dp)
                                        ) {
                                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444), modifier = Modifier.size(15.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Dialog for Adding / Editing a Point coordinate
    if (showAddPointDialog) {
        val isEditing = editingPointIndex != null
        val currentPoint = if (isEditing) points[editingPointIndex!!] else null

        var label by remember { mutableStateOf(currentPoint?.label ?: "P${points.size + 1}") }
        var xText by remember { mutableStateOf(currentPoint?.x?.toString() ?: "") }
        var yText by remember { mutableStateOf(currentPoint?.y?.toString() ?: "") }

        AlertDialog(
            onDismissRequest = { showAddPointDialog = false },
            containerColor = DarkSurfaceElevated,
            titleContentColor = TextPrimary,
            textContentColor = TextSecondary,
            title = { Text(if (isEditing) "Edit Vertex" else "Add Vertex", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = label,
                        onValueChange = { label = it },
                        label = { Text("Vertex Label") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedContainerColor = DarkSurface,
                            unfocusedContainerColor = DarkSurface
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = xText,
                        onValueChange = { xText = it },
                        label = { Text("Easting (X Coordinate)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedContainerColor = DarkSurface,
                            unfocusedContainerColor = DarkSurface
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = yText,
                        onValueChange = { yText = it },
                        label = { Text("Northing (Y Coordinate)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedContainerColor = DarkSurface,
                            unfocusedContainerColor = DarkSurface
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val x = xText.toDoubleOrNull() ?: 0.0
                        val y = yText.toDoubleOrNull() ?: 0.0
                        val newPt = AreaPoint(label = label, x = x, y = y)
                        if (isEditing) {
                            points = points.mapIndexed { idx, pt -> if (idx == editingPointIndex) newPt else pt }
                        } else {
                            points = points + newPt
                        }
                        showAddPointDialog = false
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GreenPrimary,
                        contentColor = DarkBackground
                    )
                ) {
                    Text("Save", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showAddPointDialog = false },
                    colors = ButtonDefaults.textButtonColors(contentColor = TextSecondary)
                ) {
                    Text("Cancel")
                }
            }
        )
    }
    // ==========================================
    // DIALOG: SET MEASURED DISTANCE BETWEEN 2 POINTS
    // ==========================================
    if (showSetDistanceDialog && selectedPointIndex1 != null && selectedPointIndex2 != null &&
        selectedPointIndex1!! < points.size && selectedPointIndex2!! < points.size) {
        val pt1 = points[selectedPointIndex1!!]
        val pt2 = points[selectedPointIndex2!!]
        val currentDist = hypot(pt2.x - pt1.x, pt2.y - pt1.y)

        AlertDialog(
            onDismissRequest = {
                showSetDistanceDialog = false
                selectedPointIndex1 = null
                selectedPointIndex2 = null
            },
            containerColor = DarkSurfaceElevated,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Straighten,
                        contentDescription = null,
                        tint = GreenPrimary,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "Set Distance: ${pt1.label} ➔ ${pt2.label}",
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Surface(
                        color = Color(0xFF000000),
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, DarkBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(10.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Baseline Segment:", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                Text("${pt1.label} to ${pt2.label}", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = GreenAccent)
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Current Distance:", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                Text(
                                    String.format(Locale.US, "%.4f %s", currentDist, plotterUnit.symbol),
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.Bold,
                                    color = GreenPale,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = enteredDistanceText,
                        onValueChange = { enteredDistanceText = it },
                        label = { Text("Measured Distance (${plotterUnit.symbol})") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedContainerColor = DarkSurface,
                            unfocusedContainerColor = DarkSurface,
                            focusedLabelColor = GreenPrimary,
                            unfocusedLabelColor = TextSecondary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Text(
                        text = "Adjustment Method",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary,
                        fontWeight = FontWeight.Bold
                    )

                    // Option A: Adjust Point 2 position only
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { scaleWholePolygon = false }
                            .background(
                                if (!scaleWholePolygon) GreenContainer else Color(0xFF000000),
                                RoundedCornerShape(8.dp)
                            )
                            .border(
                                BorderStroke(1.dp, if (!scaleWholePolygon) GreenPrimary else DarkBorder),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = !scaleWholePolygon,
                            onClick = { scaleWholePolygon = false },
                            colors = RadioButtonDefaults.colors(
                                selectedColor = GreenPrimary,
                                unselectedColor = TextSecondary
                            )
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                "Move ${pt2.label} along line",
                                color = if (!scaleWholePolygon) GreenPale else TextPrimary,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 12.sp
                            )
                            Text(
                                "Shifts ${pt2.label} from ${pt1.label} to match distance",
                                color = TextSecondary,
                                fontSize = 10.sp
                            )
                        }
                    }

                    // Option B: Scale entire polygon proportionally
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { scaleWholePolygon = true }
                            .background(
                                if (scaleWholePolygon) GreenContainer else Color(0xFF000000),
                                RoundedCornerShape(8.dp)
                            )
                            .border(
                                BorderStroke(1.dp, if (scaleWholePolygon) GreenPrimary else DarkBorder),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = scaleWholePolygon,
                            onClick = { scaleWholePolygon = true },
                            colors = RadioButtonDefaults.colors(
                                selectedColor = GreenPrimary,
                                unselectedColor = TextSecondary
                            )
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                "Calibrate entire plot (Scale polygon)",
                                color = if (scaleWholePolygon) GreenPale else TextPrimary,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 12.sp
                            )
                            Text(
                                "Scales all vertices proportionally to match this baseline",
                                color = TextSecondary,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val targetDist = enteredDistanceText.toDoubleOrNull()
                        if (targetDist != null && targetDist > 0 && currentDist > 0) {
                            val idx1 = selectedPointIndex1!!
                            val idx2 = selectedPointIndex2!!
                            val p1 = points[idx1]
                            val p2 = points[idx2]
                            val ratio = targetDist / currentDist
                            if (scaleWholePolygon) {
                                points = points.map { pt ->
                                    pt.copy(
                                        x = p1.x + (pt.x - p1.x) * ratio,
                                        y = p1.y + (pt.y - p1.y) * ratio
                                    )
                                }
                            } else {
                                val newP2 = p2.copy(
                                    x = p1.x + (p2.x - p1.x) * ratio,
                                    y = p1.y + (p2.y - p1.y) * ratio
                                )
                                points = points.mapIndexed { idx, p -> if (idx == idx2) newP2 else p }
                            }
                        }
                        showSetDistanceDialog = false
                        selectedPointIndex1 = null
                        selectedPointIndex2 = null
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GreenPrimary,
                        contentColor = DarkBackground
                    )
                ) {
                    Text("Apply Distance", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                Button(
                    onClick = {
                        showSetDistanceDialog = false
                        selectedPointIndex1 = null
                        selectedPointIndex2 = null
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF000000),
                        contentColor = TextSecondary
                    ),
                    border = BorderStroke(1.dp, DarkBorder)
                ) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun SystemResultBox(
    title: String,
    primary: String,
    secondary: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = DarkSurfaceElevated,
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(text = title, style = MaterialTheme.typography.labelSmall, color = TextSecondary, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = primary,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = GreenAccent,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = secondary,
                style = MaterialTheme.typography.bodySmall,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
private fun InteractivePolygonCanvas(
    points: List<AreaPoint>,
    isClosed: Boolean,
    plotterUnit: SurveyUnit,
    selectedPointIndex1: Int?,
    selectedPointIndex2: Int?,
    canvasMode: Int,
    onPointTapped: (Int) -> Unit,
    onPointAdded: (AreaPoint) -> Unit,
    modifier: Modifier = Modifier
) {
    var canvasSize by remember { mutableStateOf(Size.Zero) }

    Canvas(
        modifier = modifier
            .onSizeChanged {
                canvasSize = Size(it.width.toFloat(), it.height.toFloat())
            }
            .pointerInput(points, canvasMode, canvasSize) {
                detectTapGestures { tapOffset ->
                    if (canvasSize.width <= 0f || canvasSize.height <= 0f) return@detectTapGestures
                    val screenPoints = computeScreenPoints(points, canvasSize.width, canvasSize.height)
                    val hitRadius = 40.0
                    val hitIdx = screenPoints.indexOfFirst { pt ->
                        hypot(pt.x.toDouble() - tapOffset.x.toDouble(), pt.y.toDouble() - tapOffset.y.toDouble()) <= hitRadius
                    }

                    if (hitIdx != -1) {
                        onPointTapped(hitIdx)
                    } else if (canvasMode == 0) {
                        val mapped = screenToCadastral(tapOffset, points, canvasSize.width, canvasSize.height)
                        val newPoint = AreaPoint(
                            label = "P${points.size + 1}",
                            x = mapped.x.toDouble(),
                            y = mapped.y.toDouble()
                        )
                        onPointAdded(newPoint)
                    }
                }
            }
    ) {
        val canvasWidth = size.width
        val canvasHeight = size.height

        // 1. Draw Subtle Survey Grid
        drawSurveyGrid(canvasWidth, canvasHeight)

        if (points.isEmpty()) return@Canvas

        val screenPoints = computeScreenPoints(points, canvasWidth, canvasHeight)

        // 2. Draw Polygon Fill & Boundary in muted emerald green
        if (screenPoints.size >= 3) {
            val path = Path().apply {
                moveTo(screenPoints[0].x, screenPoints[0].y)
                for (i in 1 until screenPoints.size) {
                    lineTo(screenPoints[i].x, screenPoints[i].y)
                }
                if (isClosed) {
                    close()
                }
            }

            // Fill polygon with translucent green
            drawPath(
                path = path,
                color = Color(0x2B10B981)
            )

            // Draw Boundary line
            drawPath(
                path = path,
                color = Color(0xFF10B981),
                style = Stroke(width = 2.5f)
            )
        } else if (screenPoints.size == 2) {
            drawLine(
                color = Color(0xFF10B981),
                start = screenPoints[0],
                end = screenPoints[1],
                strokeWidth = 2.5f
            )
        }

        // 3. Draw Connecting Lines & Distance Labels on Polygon Edges
        val edgePaint = android.graphics.Paint().apply {
            color = android.graphics.Color.parseColor("#A7F3D0")
            textSize = 22f
            isAntiAlias = true
            typeface = android.graphics.Typeface.MONOSPACE
        }

        val nodeCount = screenPoints.size
        for (i in 0 until nodeCount) {
            val nextIdx = (i + 1) % nodeCount
            if (nextIdx != 0 || isClosed) {
                val p1 = screenPoints[i]
                val p2 = screenPoints[nextIdx]
                val midX = (p1.x + p2.x) / 2
                val midY = (p1.y + p2.y) / 2

                val pt1 = points[i]
                val pt2 = points[nextIdx]
                val dist = hypot(pt2.x - pt1.x, pt2.y - pt1.y)

                drawContext.canvas.nativeCanvas.drawText(
                    String.format(Locale.US, "%.1f %s", dist, plotterUnit.symbol),
                    midX + 6,
                    midY - 6,
                    edgePaint
                )
            }
        }

        // 4. Highlight Line between two selected points if different
        if (selectedPointIndex1 != null && selectedPointIndex2 != null &&
            selectedPointIndex1 < screenPoints.size && selectedPointIndex2 < screenPoints.size) {
            val p1 = screenPoints[selectedPointIndex1]
            val p2 = screenPoints[selectedPointIndex2]
            drawLine(
                color = Color(0xFF34D399),
                start = p1,
                end = p2,
                strokeWidth = 3.5f
            )
        }

        // 5. Draw Vertex Pins (Nodes) with clean dark/green aesthetic
        screenPoints.forEachIndexed { index, pos ->
            val isFirstSelected = index == selectedPointIndex1
            val isSecondSelected = index == selectedPointIndex2

            if (isFirstSelected || isSecondSelected) {
                // Highlight Halo for selected pins
                drawCircle(
                    color = Color(0x6610B981),
                    radius = 22f,
                    center = pos
                )
                drawCircle(
                    color = Color(0xFF34D399),
                    radius = 11f,
                    center = pos
                )
                drawCircle(
                    color = Color(0xFF0F172A),
                    radius = 4f,
                    center = pos
                )
            } else {
                // Outer halo
                drawCircle(
                    color = Color(0x3310B981),
                    radius = 14f,
                    center = pos
                )
                // Node core pin
                drawCircle(
                    color = Color(0xFF10B981),
                    radius = 7f,
                    center = pos
                )
                drawCircle(
                    color = Color(0xFF0F172A),
                    radius = 3f,
                    center = pos
                )
            }

            // Pin label
            val labelPaint = android.graphics.Paint().apply {
                color = if (isFirstSelected || isSecondSelected) {
                    android.graphics.Color.parseColor("#34D399")
                } else {
                    android.graphics.Color.parseColor("#A7F3D0")
                }
                textSize = if (isFirstSelected || isSecondSelected) 28f else 24f
                isFakeBoldText = true
                isAntiAlias = true
            }

            val badgeText = when {
                isFirstSelected -> "${points[index].label} (1st)"
                isSecondSelected -> "${points[index].label} (2nd)"
                else -> points[index].label
            }

            drawContext.canvas.nativeCanvas.drawText(
                badgeText,
                pos.x + 12f,
                pos.y - 12f,
                labelPaint
            )
        }
    }
}

private fun computeScreenPoints(
    points: List<AreaPoint>,
    canvasWidth: Float,
    canvasHeight: Float
): List<Offset> {
    if (points.isEmpty()) return emptyList()
    val minX = points.minOf { it.x }
    val maxX = points.maxOf { it.x }
    val minY = points.minOf { it.y }
    val maxY = points.maxOf { it.y }

    val rangeX = max(maxX - minX, 1.0)
    val rangeY = max(maxY - minY, 1.0)

    val padding = 45f
    val availableW = canvasWidth - (padding * 2)
    val availableH = canvasHeight - (padding * 2)
    val needsScaling = maxX > canvasWidth || maxY > canvasHeight || minX < 0 || minY < 0

    return points.map { pt ->
        if (needsScaling) {
            val scale = min(availableW / rangeX, availableH / rangeY).toFloat()
            val sx = padding + ((pt.x - minX) * scale).toFloat()
            val sy = canvasHeight - padding - ((pt.y - minY) * scale).toFloat()
            Offset(sx, sy)
        } else {
            Offset(pt.x.toFloat(), pt.y.toFloat())
        }
    }
}

private fun screenToCadastral(
    tapOffset: Offset,
    points: List<AreaPoint>,
    canvasWidth: Float,
    canvasHeight: Float
): Offset {
    if (points.isEmpty()) return tapOffset
    val minX = points.minOf { it.x }
    val maxX = points.maxOf { it.x }
    val minY = points.minOf { it.y }
    val maxY = points.maxOf { it.y }

    val rangeX = max(maxX - minX, 1.0)
    val rangeY = max(maxY - minY, 1.0)

    val padding = 45f
    val availableW = canvasWidth - (padding * 2)
    val availableH = canvasHeight - (padding * 2)
    val needsScaling = maxX > canvasWidth || maxY > canvasHeight || minX < 0 || minY < 0

    return if (needsScaling) {
        val scale = min(availableW / rangeX, availableH / rangeY).toFloat()
        val cx = minX + (tapOffset.x - padding) / scale
        val cy = minY + (canvasHeight - padding - tapOffset.y) / scale
        Offset(cx.toFloat(), cy.toFloat())
    } else {
        tapOffset
    }
}

private fun DrawScope.drawSurveyGrid(width: Float, height: Float) {
    val gridStep = 40f
    var x = 0f
    while (x < width) {
        drawLine(
            color = Color(0x1210B981),
            start = Offset(x, 0f),
            end = Offset(x, height),
            strokeWidth = 1f
        )
        x += gridStep
    }
    var y = 0f
    while (y < height) {
        drawLine(
            color = Color(0x1210B981),
            start = Offset(0f, y),
            end = Offset(width, y),
            strokeWidth = 1f
        )
        y += gridStep
    }
}

