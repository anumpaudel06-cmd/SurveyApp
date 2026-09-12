package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.AdjustmentRule
import com.example.model.AreaPoint
import com.example.model.DmsAngle
import com.example.model.TraverseInputRow
import com.example.service.TraverseEngine
import com.example.ui.theme.DarkBackground
import com.example.ui.theme.DarkBorder
import com.example.ui.theme.DarkBorderHighlight
import com.example.ui.theme.DarkBorderSubtle
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.DarkSurfaceElevated
import com.example.ui.theme.DarkSurfaceHighlight
import com.example.ui.theme.DarkSurfaceRowAlt
import com.example.ui.theme.GreenAccent
import com.example.ui.theme.GreenContainer
import com.example.ui.theme.GreenContainerBorder
import com.example.ui.theme.GreenPale
import com.example.ui.theme.GreenPrimary
import com.example.ui.theme.GreenPrimaryDark
import com.example.ui.theme.GreenSoft
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import java.util.Locale

@Composable
fun TraverseScreen(
    onSendToAreaCalculator: (List<AreaPoint>) -> Unit,
    modifier: Modifier = Modifier
) {
    var inputRows by remember {
        mutableStateOf(TraverseEngine.getSampleTraverse())
    }
    var selectedRule by remember {
        mutableStateOf(AdjustmentRule.BOWDITCH)
    }
    var startEastingText by remember { mutableStateOf("1000.000") }
    var startNorthingText by remember { mutableStateOf("1000.000") }

    var showAddDialog by remember { mutableStateOf(false) }
    var editingRowIndex by remember { mutableStateOf<Int?>(null) }

    val startE = startEastingText.toDoubleOrNull() ?: 1000.0
    val startN = startNorthingText.toDoubleOrNull() ?: 1000.0

    // Compute Traverse dynamically
    val (computedRows, summary) = remember(inputRows, selectedRule, startE, startN) {
        TraverseEngine.computeTraverse(inputRows, selectedRule, startE, startN)
    }

    val verticalScroll = rememberScrollState()
    val tableHorizontalScroll = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .verticalScroll(verticalScroll)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section Header (Minimal, Clean)
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "Traverse Computation Engine",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Closed traverse adjustment via Bowditch (Compass) and Transit balancing",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )
        }

        // Rule Selection & Initial Settings Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, DarkBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Tune,
                            contentDescription = null,
                            tint = GreenPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Balancing Rule & Datum",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val isBowditch = selectedRule == AdjustmentRule.BOWDITCH
                    Button(
                        onClick = { selectedRule = AdjustmentRule.BOWDITCH },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .testTag("rule_bowditch_chip"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isBowditch) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isBowditch) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(
                            1.dp,
                            if (isBowditch) GreenPrimary else DarkBorder
                        )
                    ) {
                        Text(
                            "Bowditch (Compass)",
                            fontSize = 12.sp,
                            fontWeight = if (isBowditch) FontWeight.Bold else FontWeight.Normal
                        )
                    }

                    val isTransit = selectedRule == AdjustmentRule.TRANSIT
                    Button(
                        onClick = { selectedRule = AdjustmentRule.TRANSIT },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .testTag("rule_transit_chip"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isTransit) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isTransit) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(
                            1.dp,
                            if (isTransit) GreenPrimary else DarkBorder
                        )
                    ) {
                        Text(
                            "Transit Rule",
                            fontSize = 12.sp,
                            fontWeight = if (isTransit) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = startEastingText,
                        onValueChange = { startEastingText = it },
                        label = { Text("Initial Easting E₀ (m)", fontSize = 11.sp) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedContainerColor = DarkSurfaceElevated,
                            unfocusedContainerColor = DarkSurfaceElevated,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedLabelColor = GreenPrimary,
                            unfocusedLabelColor = TextSecondary
                        ),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )
                    OutlinedTextField(
                        value = startNorthingText,
                        onValueChange = { startNorthingText = it },
                        label = { Text("Initial Northing N₀ (m)", fontSize = 11.sp) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedContainerColor = DarkSurfaceElevated,
                            unfocusedContainerColor = DarkSurfaceElevated,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedLabelColor = GreenPrimary,
                            unfocusedLabelColor = TextSecondary
                        ),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )
                }
            }
        }

        // Action Toolbar with Fixed, Properly Formatted Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Primary Add Station button
                Button(
                    onClick = {
                        editingRowIndex = null
                        showAddDialog = true
                    },
                    modifier = Modifier
                        .weight(1.3f)
                        .height(46.dp)
                        .testTag("add_station_button"),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GreenPrimary,
                        contentColor = DarkBackground
                    )
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Add Station", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }

                // Sample Loop button
                OutlinedButton(
                    onClick = {
                        inputRows = TraverseEngine.getSampleTraverse()
                    },
                    modifier = Modifier
                        .weight(1f)
                        .height(46.dp)
                        .testTag("load_sample_traverse_button"),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, DarkBorder),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = DarkSurfaceElevated,
                        contentColor = TextPrimary
                    )
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp), tint = GreenSoft)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Sample", fontSize = 12.sp)
                }

                // Clear button
                OutlinedButton(
                    onClick = {
                        inputRows = emptyList()
                    },
                    modifier = Modifier
                        .weight(0.8f)
                        .height(46.dp)
                        .testTag("clear_traverse_button"),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, DarkBorder),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = DarkSurfaceElevated,
                        contentColor = TextSecondary
                    )
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Clear", fontSize = 12.sp)
                }
            }

            // High-visibility dedicated Send to Area Calculator button
            Button(
                onClick = {
                    val points = computedRows.map { row ->
                        AreaPoint(
                            label = row.station,
                            x = row.correctedEasting,
                            y = row.correctedNorthing
                        )
                    }
                    onSendToAreaCalculator(points)
                },
                enabled = computedRows.isNotEmpty(),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .testTag("send_to_area_calc_button"),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = GreenContainer,
                    contentColor = GreenPale,
                    disabledContainerColor = DarkSurfaceElevated,
                    disabledContentColor = TextMuted
                ),
                border = BorderStroke(1.dp, if (computedRows.isNotEmpty()) GreenContainerBorder else DarkBorder)
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    "Send Balanced Coordinates to Area Plotter",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp
                )
            }
        }

        // ==========================================
        // DYNAMIC TABLE WITH EXACT REQUESTED COLUMNS:
        // S.N., STATION, CORRECTED ANGLES, LINE, BEARING, DISTANCE (m),
        // ΔE, ΔN, Corrected ΔE, Corrected ΔN, Corrected Easting, Corrected Northing
        // ==========================================
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("traverse_table_card"),
            shape = RoundedCornerShape(10.dp),
            border = BorderStroke(1.dp, DarkBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(tableHorizontalScroll)
            ) {
                Column {
                    // Header Row
                    Row(
                        modifier = Modifier
                            .background(DarkSurfaceElevated)
                            .padding(vertical = 10.dp, horizontal = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        TableHeaderCell("S.N.", width = 50.dp)
                        TableHeaderCell("STATION", width = 85.dp)
                        TableHeaderCell("CORRECTED ANGLES", width = 140.dp)
                        TableHeaderCell("LINE", width = 75.dp)
                        TableHeaderCell("BEARING", width = 130.dp)
                        TableHeaderCell("DISTANCE (m)", width = 110.dp)
                        TableHeaderCell("ΔE", width = 95.dp)
                        TableHeaderCell("ΔN", width = 95.dp)
                        TableHeaderCell("Corrected ΔE", width = 105.dp)
                        TableHeaderCell("Corrected ΔN", width = 105.dp)
                        TableHeaderCell("Corrected Easting", width = 135.dp)
                        TableHeaderCell("Corrected Northing", width = 135.dp)
                        TableHeaderCell("ACTION", width = 75.dp)
                    }

                    if (computedRows.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(36.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "No traverse stations. Tap 'Add Station' or 'Sample'.",
                                color = TextSecondary,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    } else {
                        computedRows.forEachIndexed { index, row ->
                            val isEven = index % 2 == 0
                            val bgColor = if (isEven) DarkSurface else DarkSurfaceRowAlt

                            Row(
                                modifier = Modifier
                                    .background(bgColor)
                                    .border(BorderStroke(0.5.dp, DarkBorderSubtle))
                                    .padding(vertical = 8.dp, horizontal = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                TableDataCell("${row.sn}", width = 50.dp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                TableDataCell(row.station, width = 85.dp, fontWeight = FontWeight.SemiBold, color = GreenPale)
                                TableDataCell(row.correctedAngle.toFormattedString(), width = 140.dp, color = TextPrimary)
                                TableDataCell(row.line, width = 75.dp, color = GreenSoft)
                                TableDataCell(row.bearing.toFormattedString(), width = 130.dp, color = GreenSoft)
                                TableDataCell(String.format(Locale.US, "%.3f", row.distance), width = 110.dp, color = TextPrimary)
                                TableDataCell(String.format(Locale.US, "%+.3f", row.deltaE), width = 95.dp, color = TextSecondary)
                                TableDataCell(String.format(Locale.US, "%+.3f", row.deltaN), width = 95.dp, color = TextSecondary)
                                TableDataCell(
                                    String.format(Locale.US, "%+.3f", row.correctedDeltaE),
                                    width = 105.dp,
                                    color = GreenAccent,
                                    fontWeight = FontWeight.SemiBold
                                )
                                TableDataCell(
                                    String.format(Locale.US, "%+.3f", row.correctedDeltaN),
                                    width = 105.dp,
                                    color = GreenAccent,
                                    fontWeight = FontWeight.SemiBold
                                )
                                TableDataCell(
                                    String.format(Locale.US, "%.3f", row.correctedEasting),
                                    width = 135.dp,
                                    color = GreenPale,
                                    fontWeight = FontWeight.Bold
                                )
                                TableDataCell(
                                    String.format(Locale.US, "%.3f", row.correctedNorthing),
                                    width = 135.dp,
                                    color = GreenPale,
                                    fontWeight = FontWeight.Bold
                                )

                                Row(
                                    modifier = Modifier.width(75.dp),
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    IconButton(
                                        onClick = {
                                            editingRowIndex = index
                                            showAddDialog = true
                                        },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Edit,
                                            contentDescription = "Edit",
                                            tint = GreenSoft,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                    IconButton(
                                        onClick = {
                                            inputRows = inputRows.filterIndexed { i, _ -> i != index }
                                        },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Delete,
                                            contentDescription = "Delete",
                                            tint = TextSecondary,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Summary of Traverse Misclosure (Positioned AFTER the table as requested)
        summary?.let { sum ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("traverse_summary_card"),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, GreenContainerBorder),
                colors = CardDefaults.cardColors(containerColor = DarkSurface)
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Traverse Closure & Precision",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = GreenAccent
                        )
                        Surface(
                            color = GreenContainer,
                            shape = RoundedCornerShape(6.dp),
                            border = BorderStroke(1.dp, GreenContainerBorder)
                        ) {
                            Text(
                                text = if (sum.relativePrecisionDenominator > 0)
                                    "1 : %,d".format(Locale.US, sum.relativePrecisionDenominator)
                                else "N/A",
                                color = GreenPale,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        SummaryMetric(
                            label = "Perimeter (L)",
                            value = String.format(Locale.US, "%.3f m", sum.totalPerimeter)
                        )
                        SummaryMetric(
                            label = "Misclosure (e)",
                            value = String.format(Locale.US, "%.4f m", sum.linearMisclosure)
                        )
                        SummaryMetric(
                            label = "Error Bearing",
                            value = sum.misclosureBearing.toFormattedString()
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        SummaryMetric(
                            label = "Σ Raw ΔE (Dep)",
                            value = String.format(Locale.US, "%+.4f m", sum.sumDeltaE)
                        )
                        SummaryMetric(
                            label = "Σ Raw ΔN (Lat)",
                            value = String.format(Locale.US, "%+.4f m", sum.sumDeltaN)
                        )
                        SummaryMetric(
                            label = "Balancing Rule",
                            value = sum.adjustmentRule.displayName.split(" ")[0]
                        )
                    }
                }
            }
        }
    }

    // Dialog for Adding / Editing a Traverse Station
    if (showAddDialog) {
        val isEditing = editingRowIndex != null
        val currentRow = if (isEditing) inputRows[editingRowIndex!!] else null
        val isFirstStation = if (isEditing) editingRowIndex == 0 else inputRows.isEmpty()

        TraverseStationDialog(
            isEditing = isEditing,
            isFirstStation = isFirstStation,
            initialStation = currentRow?.station ?: "P${inputRows.size + 1}",
            initialLine = currentRow?.line ?: (if (inputRows.isNotEmpty()) "${inputRows.last().station}-P${inputRows.size + 1}" else "1-2"),
            initialAngle = currentRow?.correctedAngle ?: DmsAngle(90, 0, 0.0),
            initialDistance = currentRow?.distance ?: 100.0,
            initialBearing = currentRow?.initialBearing ?: DmsAngle(45, 0, 0.0),
            onDismiss = { showAddDialog = false },
            onConfirm = { station, line, angle, distance, bearing ->
                val newRow = TraverseInputRow(
                    station = station,
                    line = line,
                    correctedAngle = angle,
                    distance = distance,
                    initialBearing = if (isFirstStation) bearing else null
                )
                if (isEditing) {
                    inputRows = inputRows.mapIndexed { idx, row ->
                        if (idx == editingRowIndex) newRow else row
                    }
                } else {
                    inputRows = inputRows + newRow
                }
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun TableHeaderCell(text: String, width: androidx.compose.ui.unit.Dp) {
    Text(
        text = text,
        modifier = Modifier
            .width(width)
            .padding(horizontal = 4.dp),
        color = GreenPale,
        style = MaterialTheme.typography.labelSmall,
        fontWeight = FontWeight.Bold,
        textAlign = TextAlign.Center
    )
}

@Composable
private fun TableDataCell(
    text: String,
    width: androidx.compose.ui.unit.Dp,
    color: Color = TextPrimary,
    fontWeight: FontWeight = FontWeight.Normal
) {
    Text(
        text = text,
        modifier = Modifier
            .width(width)
            .padding(horizontal = 4.dp),
        color = color,
        style = MaterialTheme.typography.bodySmall,
        fontWeight = fontWeight,
        fontFamily = FontFamily.Monospace,
        textAlign = TextAlign.Center
    )
}

@Composable
private fun SummaryMetric(label: String, value: String) {
    Column {
        Text(text = label, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            color = GreenPale,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
private fun TraverseStationDialog(
    isEditing: Boolean,
    isFirstStation: Boolean,
    initialStation: String,
    initialLine: String,
    initialAngle: DmsAngle,
    initialDistance: Double,
    initialBearing: DmsAngle,
    onDismiss: () -> Unit,
    onConfirm: (station: String, line: String, angle: DmsAngle, distance: Double, bearing: DmsAngle) -> Unit
) {
    var station by remember { mutableStateOf(initialStation) }
    var line by remember { mutableStateOf(initialLine) }
    var degText by remember { mutableStateOf("${initialAngle.degrees}") }
    var minText by remember { mutableStateOf("${initialAngle.minutes}") }
    var secText by remember { mutableStateOf("${initialAngle.seconds}") }
    var distanceText by remember { mutableStateOf("$initialDistance") }

    // Bearing for initial station
    var bDegText by remember { mutableStateOf("${initialBearing.degrees}") }
    var bMinText by remember { mutableStateOf("${initialBearing.minutes}") }
    var bSecText by remember { mutableStateOf("${initialBearing.seconds}") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DarkSurfaceElevated,
        titleContentColor = TextPrimary,
        textContentColor = TextPrimary,
        title = {
            Text(
                if (isEditing) "Edit Traverse Station" else "Add Traverse Station",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = station,
                        onValueChange = { station = it },
                        label = { Text("Station") },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                    OutlinedTextField(
                        value = line,
                        onValueChange = { line = it },
                        label = { Text("Line (e.g. 1-2)") },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                }

                OutlinedTextField(
                    value = distanceText,
                    onValueChange = { distanceText = it },
                    label = { Text("Distance (m)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GreenPrimary,
                        unfocusedBorderColor = DarkBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Text(
                    text = "Corrected Angle (DMS):",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = GreenAccent
                )
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    OutlinedTextField(
                        value = degText,
                        onValueChange = { degText = it },
                        label = { Text("Deg (°)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                    OutlinedTextField(
                        value = minText,
                        onValueChange = { minText = it },
                        label = { Text("Min (')") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                    OutlinedTextField(
                        value = secText,
                        onValueChange = { secText = it },
                        label = { Text("Sec (\")") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GreenPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                }

                if (isFirstStation) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Initial Bearing (DMS) for Station 1:",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = GreenSoft
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        OutlinedTextField(
                            value = bDegText,
                            onValueChange = { bDegText = it },
                            label = { Text("Deg (°)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = GreenPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        OutlinedTextField(
                            value = bMinText,
                            onValueChange = { bMinText = it },
                            label = { Text("Min (')") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = GreenPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        OutlinedTextField(
                            value = bSecText,
                            onValueChange = { bSecText = it },
                            label = { Text("Sec (\")") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = GreenPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val angle = DmsAngle(
                        degText.toIntOrNull() ?: 0,
                        minText.toIntOrNull() ?: 0,
                        secText.toDoubleOrNull() ?: 0.0
                    )
                    val bearing = DmsAngle(
                        bDegText.toIntOrNull() ?: 0,
                        bMinText.toIntOrNull() ?: 0,
                        bSecText.toDoubleOrNull() ?: 0.0
                    )
                    val dist = distanceText.toDoubleOrNull() ?: 0.0
                    onConfirm(station, line, angle, dist, bearing)
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = GreenPrimary,
                    contentColor = DarkBackground
                )
            ) {
                Text("Save", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = TextSecondary)
            }
        }
    )
}

