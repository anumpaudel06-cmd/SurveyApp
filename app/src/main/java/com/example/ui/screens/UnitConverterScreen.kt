package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Landscape
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material.icons.filled.Terrain
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SurveyConstants
import com.example.model.SurveyUnit
import com.example.model.UnitCategory
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

@Composable
fun UnitConverterScreen(
    modifier: Modifier = Modifier
) {
    // Current active area result state
    var currentResult by remember {
        mutableStateOf(AreaEngine.fromRopaniSubunits(1.0, 0.0, 0.0, 0.0)) // Default 1 Ropani
    }

    // Input States for Ropani System
    var ropaniText by remember { mutableStateOf("1") }
    var aanaText by remember { mutableStateOf("0") }
    var paisaText by remember { mutableStateOf("0") }
    var daamText by remember { mutableStateOf("0") }

    // Input States for Bigha System
    var bighaText by remember { mutableStateOf("") }
    var katthaText by remember { mutableStateOf("") }
    var dhurText by remember { mutableStateOf("") }

    // Input States for Sq.Ft/M
    var sqFeetText by remember { mutableStateOf("") }
    var sqMetersText by remember { mutableStateOf("") }

    var ratesExpanded by remember { mutableStateOf(false) }

    // Universal Unit Converter States
    var activeCategory by remember { mutableStateOf(UnitCategory.LENGTH) }
    var universalInputText by remember { mutableStateOf("1") }
    var fromUnitLength by remember { mutableStateOf(SurveyUnit.LENGTH_UNITS[0]) } // Meter
    var toUnitLength by remember { mutableStateOf(SurveyUnit.LENGTH_UNITS[1]) }   // Feet
    var fromUnitArea by remember { mutableStateOf(SurveyUnit.AREA_UNITS[0]) }     // Sq.Meter
    var toUnitArea by remember { mutableStateOf(SurveyUnit.AREA_UNITS[1]) }       // Sq.Feet

    val currentFromUnit = if (activeCategory == UnitCategory.LENGTH) fromUnitLength else fromUnitArea
    val currentToUnit = if (activeCategory == UnitCategory.LENGTH) toUnitLength else toUnitArea
    val universalInputValue = universalInputText.toDoubleOrNull() ?: 0.0
    val universalConvertedValue by remember(universalInputValue, currentFromUnit, currentToUnit) {
        derivedStateOf {
            SurveyUnit.convert(universalInputValue, currentFromUnit, currentToUnit)
        }
    }

    var showFromMenu by remember { mutableStateOf(false) }
    var showToMenu by remember { mutableStateOf(false) }

    val verticalScroll = rememberScrollState()
    val horizontalRowScroll = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .verticalScroll(verticalScroll)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section Header (Minimal, Clean)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "Cadastral Unit Converter",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Convert across Ropani, Bigha, Metric & Imperial land units",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            OutlinedButton(
                onClick = {
                    ropaniText = ""
                    aanaText = ""
                    paisaText = ""
                    daamText = ""
                    bighaText = ""
                    katthaText = ""
                    dhurText = ""
                    sqFeetText = ""
                    sqMetersText = ""
                    universalInputText = "1"
                    currentResult = AreaEngine.fromSqMeters(0.0)
                },
                modifier = Modifier
                    .height(38.dp)
                    .testTag("reset_converter_button"),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, DarkBorder),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = DarkSurfaceElevated,
                    contentColor = TextSecondary
                )
            ) {
                Icon(Icons.Default.Clear, contentDescription = null, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Reset", fontSize = 12.sp)
            }
        }

        // ==========================================
        // UNIVERSAL SMOOTH UNIT CONVERTER
        // Any unit to any other unit (e.g. meter to ft, sq.m to sq.ft/ropani/bigha)
        // ==========================================
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("universal_converter_card"),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, GreenContainerBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Instant Unit Converter",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = GreenPale
                    )
                    Surface(
                        color = GreenContainer,
                        shape = RoundedCornerShape(6.dp),
                        border = BorderStroke(1.dp, GreenContainerBorder)
                    ) {
                        Text(
                            text = "Standard Precision",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = GreenAccent,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Category Selection Buttons: Selected in Green, Non-selected in Black with plain text
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val isLength = activeCategory == UnitCategory.LENGTH
                    Button(
                        onClick = { activeCategory = UnitCategory.LENGTH },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .testTag("category_length_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isLength) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isLength) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(1.dp, if (isLength) GreenPrimary else DarkBorder)
                    ) {
                        Icon(
                            Icons.Default.Straighten,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = if (isLength) DarkBackground else TextSecondary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            "Distance / Length",
                            fontSize = 12.sp,
                            fontWeight = if (isLength) FontWeight.Bold else FontWeight.Normal
                        )
                    }

                    val isArea = activeCategory == UnitCategory.AREA
                    Button(
                        onClick = { activeCategory = UnitCategory.AREA },
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp)
                            .testTag("category_area_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isArea) GreenPrimary else Color(0xFF000000),
                            contentColor = if (isArea) DarkBackground else TextSecondary
                        ),
                        border = BorderStroke(1.dp, if (isArea) GreenPrimary else DarkBorder)
                    ) {
                        Icon(
                            Icons.Default.Terrain,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = if (isArea) DarkBackground else TextSecondary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            "Land Area",
                            fontSize = 12.sp,
                            fontWeight = if (isArea) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }

                // Input value field
                OutlinedTextField(
                    value = universalInputText,
                    onValueChange = { universalInputText = it },
                    label = { Text("Enter Value to Convert", fontSize = 12.sp) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
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
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("universal_input_field")
                )

                // From Unit & To Unit selection with Swap
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // From Unit selector
                    Box(modifier = Modifier.weight(1f)) {
                        UnitSelectorButton(
                            unit = currentFromUnit,
                            label = "From Unit",
                            onClick = { showFromMenu = true },
                            testTag = "from_unit_selector"
                        )
                        DropdownMenu(
                            expanded = showFromMenu,
                            onDismissRequest = { showFromMenu = false },
                            modifier = Modifier.background(DarkSurfaceElevated)
                        ) {
                            val list = if (activeCategory == UnitCategory.LENGTH) SurveyUnit.LENGTH_UNITS else SurveyUnit.AREA_UNITS
                            list.forEach { u ->
                                DropdownMenuItem(
                                    text = { Text("${u.name} (${u.symbol})", color = TextPrimary) },
                                    onClick = {
                                        if (activeCategory == UnitCategory.LENGTH) fromUnitLength = u else fromUnitArea = u
                                        showFromMenu = false
                                    }
                                )
                            }
                        }
                    }

                    // Swap Button
                    IconButton(
                        onClick = {
                            if (activeCategory == UnitCategory.LENGTH) {
                                val temp = fromUnitLength
                                fromUnitLength = toUnitLength
                                toUnitLength = temp
                            } else {
                                val temp = fromUnitArea
                                fromUnitArea = toUnitArea
                                toUnitArea = temp
                            }
                        },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color(0xFF000000), RoundedCornerShape(8.dp))
                            .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(8.dp))
                            .testTag("swap_units_button")
                    ) {
                        Icon(
                            Icons.Default.SwapHoriz,
                            contentDescription = "Swap Units",
                            tint = GreenSoft,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // To Unit selector
                    Box(modifier = Modifier.weight(1f)) {
                        UnitSelectorButton(
                            unit = currentToUnit,
                            label = "To Unit",
                            onClick = { showToMenu = true },
                            testTag = "to_unit_selector"
                        )
                        DropdownMenu(
                            expanded = showToMenu,
                            onDismissRequest = { showToMenu = false },
                            modifier = Modifier.background(DarkSurfaceElevated)
                        ) {
                            val list = if (activeCategory == UnitCategory.LENGTH) SurveyUnit.LENGTH_UNITS else SurveyUnit.AREA_UNITS
                            list.forEach { u ->
                                DropdownMenuItem(
                                    text = { Text("${u.name} (${u.symbol})", color = TextPrimary) },
                                    onClick = {
                                        if (activeCategory == UnitCategory.LENGTH) toUnitLength = u else toUnitArea = u
                                        showToMenu = false
                                    }
                                )
                            }
                        }
                    }
                }

                // Primary Output Display
                Surface(
                    color = GreenContainer,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, GreenContainerBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "CONVERTED RESULT",
                            style = MaterialTheme.typography.labelSmall,
                            color = GreenPale,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = if (universalConvertedValue >= 10000 || (universalConvertedValue < 0.001 && universalConvertedValue > 0)) {
                                String.format(Locale.US, "%,.6f %s", universalConvertedValue, currentToUnit.symbol)
                            } else {
                                String.format(Locale.US, "%.6f %s", universalConvertedValue, currentToUnit.symbol)
                            },
                            style = MaterialTheme.typography.headlineSmall,
                            color = GreenAccent,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = String.format(
                                Locale.US,
                                "Standard ratio: 1 %s = %.6f %s",
                                currentFromUnit.symbol,
                                SurveyUnit.convert(1.0, currentFromUnit, currentToUnit),
                                currentToUnit.symbol
                            ),
                            style = MaterialTheme.typography.bodySmall,
                            color = GreenPale,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Instant Conversion Matrix (Equivalent in other popular units)
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "QUICK EQUIVALENTS",
                        style = MaterialTheme.typography.labelSmall,
                        color = GreenSoft,
                        fontWeight = FontWeight.Bold
                    )
                    val sampleUnits = if (activeCategory == UnitCategory.LENGTH) {
                        listOf(
                            SurveyUnit.LENGTH_UNITS.first { it.id == "m" },
                            SurveyUnit.LENGTH_UNITS.first { it.id == "ft" },
                            SurveyUnit.LENGTH_UNITS.first { it.id == "in" },
                            SurveyUnit.LENGTH_UNITS.first { it.id == "yd" },
                            SurveyUnit.LENGTH_UNITS.first { it.id == "ch" },
                            SurveyUnit.LENGTH_UNITS.first { it.id == "li" }
                        )
                    } else {
                        listOf(
                            SurveyUnit.AREA_UNITS.first { it.id == "sqm" },
                            SurveyUnit.AREA_UNITS.first { it.id == "sqft" },
                            SurveyUnit.AREA_UNITS.first { it.id == "ropani" },
                            SurveyUnit.AREA_UNITS.first { it.id == "aana" },
                            SurveyUnit.AREA_UNITS.first { it.id == "bigha" },
                            SurveyUnit.AREA_UNITS.first { it.id == "kattha" }
                        )
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DarkSurfaceElevated, RoundedCornerShape(8.dp))
                            .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(8.dp))
                            .padding(8.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        sampleUnits.chunked(2).forEach { pair ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                pair.forEach { u ->
                                    val eq = SurveyUnit.convert(universalInputValue, currentFromUnit, u)
                                    Row(
                                        modifier = Modifier
                                            .weight(1f)
                                            .background(Color(0xFF000000), RoundedCornerShape(6.dp))
                                            .padding(horizontal = 8.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(u.name, style = MaterialTheme.typography.bodySmall, color = TextSecondary, fontSize = 11.sp)
                                        Text(
                                            String.format(Locale.US, "%.4f %s", eq, u.symbol),
                                            style = MaterialTheme.typography.bodySmall,
                                            fontWeight = FontWeight.SemiBold,
                                            color = GreenAccent,
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 11.sp
                                        )
                                    }
                                }
                                if (pair.size == 1) {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 1. TOP SECTION (INPUTS)
        // Horizontal row of three distinct cards
        // ==========================================
        Text(
            text = "INPUT SYSTEMS",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = GreenSoft,
            letterSpacing = 1.1.sp
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(horizontalRowScroll),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Card 1: Ropani System Input
            InputCard(
                title = "Ropani System",
                subtitle = "Hilly Region (R-A-P-D)",
                icon = Icons.Default.Terrain,
                modifier = Modifier.width(280.dp)
            ) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    UnitInputField(
                        label = "Ropani",
                        value = ropaniText,
                        onValueChange = { ropaniText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_ropani"
                    )
                    UnitInputField(
                        label = "Aana",
                        value = aanaText,
                        onValueChange = { aanaText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_aana"
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    UnitInputField(
                        label = "Paisa",
                        value = paisaText,
                        onValueChange = { paisaText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_paisa"
                    )
                    UnitInputField(
                        label = "Daam",
                        value = daamText,
                        onValueChange = { daamText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_daam"
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = {
                        val r = ropaniText.toDoubleOrNull() ?: 0.0
                        val a = aanaText.toDoubleOrNull() ?: 0.0
                        val p = paisaText.toDoubleOrNull() ?: 0.0
                        val d = daamText.toDoubleOrNull() ?: 0.0
                        currentResult = AreaEngine.fromRopaniSubunits(r, a, p, d)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("apply_ropani_button"),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GreenPrimary,
                        contentColor = DarkBackground
                    )
                ) {
                    Icon(Icons.Default.Calculate, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Convert Ropani", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }

            // Card 2: Bigha System Input
            InputCard(
                title = "Bigha System",
                subtitle = "Terai Region (B-K-D)",
                icon = Icons.Default.Landscape,
                modifier = Modifier.width(280.dp)
            ) {
                UnitInputField(
                    label = "Bigha",
                    value = bighaText,
                    onValueChange = { bighaText = it },
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "input_bigha"
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    UnitInputField(
                        label = "Kattha",
                        value = katthaText,
                        onValueChange = { katthaText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_kattha"
                    )
                    UnitInputField(
                        label = "Dhur",
                        value = dhurText,
                        onValueChange = { dhurText = it },
                        modifier = Modifier.weight(1f),
                        testTag = "input_dhur"
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = {
                        val b = bighaText.toDoubleOrNull() ?: 0.0
                        val k = katthaText.toDoubleOrNull() ?: 0.0
                        val dh = dhurText.toDoubleOrNull() ?: 0.0
                        currentResult = AreaEngine.fromBighaSubunits(b, k, dh)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("apply_bigha_button"),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GreenPrimary,
                        contentColor = DarkBackground
                    )
                ) {
                    Icon(Icons.Default.Calculate, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Convert Bigha", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }

            // Card 3: Sq.Ft/M Input
            InputCard(
                title = "Imperial & Metric",
                subtitle = "Square Feet & Meters",
                icon = Icons.Default.Straighten,
                modifier = Modifier.width(280.dp)
            ) {
                UnitInputField(
                    label = "Square Feet (sq.ft)",
                    value = sqFeetText,
                    onValueChange = { sqFeetText = it },
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "input_sqft"
                )
                Spacer(modifier = Modifier.height(8.dp))
                UnitInputField(
                    label = "Square Meters (sq.m)",
                    value = sqMetersText,
                    onValueChange = { sqMetersText = it },
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "input_sqm"
                )
                Spacer(modifier = Modifier.height(10.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = {
                            val sqft = sqFeetText.toDoubleOrNull() ?: 0.0
                            currentResult = AreaEngine.fromSqFeet(sqft)
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("apply_sqft_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GreenContainer,
                            contentColor = GreenPale
                        ),
                        border = BorderStroke(1.dp, GreenContainerBorder)
                    ) {
                        Text("Use Sq.Ft", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, maxLines = 1)
                    }
                    Button(
                        onClick = {
                            val sqm = sqMetersText.toDoubleOrNull() ?: 0.0
                            currentResult = AreaEngine.fromSqMeters(sqm)
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("apply_sqm_button"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GreenPrimary,
                            contentColor = DarkBackground
                        )
                    ) {
                        Text("Use Sq.M", fontSize = 12.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                    }
                }
            }
        }

        // ==========================================
        // 2. MIDDLE SECTION (RESULTS)
        // Large bordered container titled "Conversion Results"
        // containing three column-style cards with unit name on left
        // and calculated value in crisp Mint Green on the right.
        // ==========================================
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("conversion_results_container"),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, GreenContainerBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Conversion Results",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = GreenPale
                    )
                    Surface(
                        color = GreenContainer,
                        shape = RoundedCornerShape(6.dp),
                        border = BorderStroke(1.dp, GreenContainerBorder)
                    ) {
                        Text(
                            text = "Live Sync",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = GreenAccent,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Three column-style cards inside results container
                Column(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Result Card 1: Ropani System
                    ResultColumnCard(
                        categoryTitle = "Ropani System (Hilly Region)",
                        icon = Icons.Default.Terrain,
                        summaryLabel = "Notation (R-A-P-D)",
                        summaryValue = currentResult.rapdFormatted,
                        items = listOf(
                            "Ropani" to String.format(Locale.US, "%d", currentResult.ropaniInt),
                            "Aana" to String.format(Locale.US, "%d", currentResult.aanaInt),
                            "Paisa" to String.format(Locale.US, "%d", currentResult.paisaInt),
                            "Daam" to String.format(Locale.US, "%.2f", currentResult.daamDouble),
                            "Total Decimal Ropani" to String.format(Locale.US, "%.5f R", currentResult.decimalRopani)
                        )
                    )

                    // Result Card 2: Bigha System
                    ResultColumnCard(
                        categoryTitle = "Bigha System (Terai Region)",
                        icon = Icons.Default.Landscape,
                        summaryLabel = "Notation (B-K-D)",
                        summaryValue = currentResult.bkdFormatted,
                        items = listOf(
                            "Bigha" to String.format(Locale.US, "%d", currentResult.bighaInt),
                            "Kattha" to String.format(Locale.US, "%d", currentResult.katthaInt),
                            "Dhur" to String.format(Locale.US, "%.2f", currentResult.dhurDouble),
                            "Total Decimal Bigha" to String.format(Locale.US, "%.5f B", currentResult.decimalBigha)
                        )
                    )

                    // Result Card 3: Metric & Imperial System
                    ResultColumnCard(
                        categoryTitle = "Metric & Imperial Systems",
                        icon = Icons.Default.Straighten,
                        summaryLabel = "Area Footprint",
                        summaryValue = String.format(Locale.US, "%.2f sq.m  (%.2f sq.ft)", currentResult.sqMeters, currentResult.sqFeet),
                        items = listOf(
                            "Square Meters (sq.m)" to String.format(Locale.US, "%,.2f", currentResult.sqMeters),
                            "Square Feet (sq.ft)" to String.format(Locale.US, "%,.2f", currentResult.sqFeet),
                            "Hectares (ha)" to String.format(Locale.US, "%.4f", currentResult.hectares),
                            "Acres" to String.format(Locale.US, "%.4f", currentResult.acres)
                        )
                    )
                }
            }
        }

        // ==========================================
        // 3. BOTTOM SECTION (INFO)
        // Expandable card titled "Conversion Rates"
        // ==========================================
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("conversion_rates_card"),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, DarkBorder),
            colors = CardDefaults.cardColors(containerColor = DarkSurface)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = null,
                            tint = GreenSoft,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Conversion Constants & Cadastral Ratios",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                    IconButton(
                        onClick = { ratesExpanded = !ratesExpanded },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(
                            imageVector = if (ratesExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = if (ratesExpanded) "Collapse" else "Expand",
                            tint = TextSecondary
                        )
                    }
                }

                AnimatedVisibility(visible = ratesExpanded) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        RateGroup(
                            title = "Bigha System (Terai Region):",
                            lines = listOf(
                                "1 Bigha = 20 Kattha = 6772.63 sq.m = 72900 sq.ft.",
                                "1 Kattha = 20 Dhur = 338.63 sq.m = 3645 sq.ft.",
                                "1 Dhur = 16.93 sq.m = 182.25 sq.ft."
                            )
                        )
                        HorizontalDivider(color = DarkBorder)
                        RateGroup(
                            title = "Ropani System (Hilly Region):",
                            lines = listOf(
                                "1 Ropani = 16 Aana = 508.72 sq.m = 5476 sq.ft.",
                                "1 Aana = 4 Paisa = 31.80 sq.m = 342.25 sq.ft.",
                                "1 Paisa = 4 Daam = 7.95 sq.m = 85.56 sq.ft.",
                                "1 Daam = 1.99 sq.m = 21.39 sq.ft."
                            )
                        )
                        HorizontalDivider(color = DarkBorder)
                        RateGroup(
                            title = "Standard Conversions:",
                            lines = listOf(
                                "1 Ropani ≈ 0.0752 Bigha | 1 Bigha ≈ 13.31 Ropani",
                                "1 sq.m ≈ 10.7639 sq.ft. | 1 Hectare = 10,000 sq.m",
                                "1 Acre = 43,560 sq.ft. (≈ 4046.86 sq.m)"
                            )
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InputCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, DarkBorder),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = GreenPrimary, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(text = title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text(text = subtitle, style = MaterialTheme.typography.bodySmall, color = TextSecondary, fontSize = 11.sp)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
private fun UnitInputField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    testTag: String
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontSize = 12.sp) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
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
        shape = RoundedCornerShape(8.dp),
        modifier = modifier.testTag(testTag)
    )
}

@Composable
private fun ResultColumnCard(
    categoryTitle: String,
    icon: ImageVector,
    summaryLabel: String,
    summaryValue: String,
    items: List<Pair<String, String>>
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, DarkBorder),
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceElevated)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(icon, contentDescription = null, tint = GreenSoft, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = categoryTitle,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Spacer(modifier = Modifier.height(8.dp))

            // Highlight bar
            Surface(
                color = GreenContainer,
                shape = RoundedCornerShape(6.dp),
                border = BorderStroke(1.dp, GreenContainerBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = summaryLabel, style = MaterialTheme.typography.bodySmall, color = GreenPale)
                    Text(
                        text = summaryValue,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = GreenAccent,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Clean Table format: unit name on left, calculated value in Mint Green on the right
            items.forEachIndexed { index, (unitName, value) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            if (index % 2 == 0) Color.Transparent else DarkSurfaceRowAlt,
                            RoundedCornerShape(4.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = unitName,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                    Text(
                        text = value,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = GreenAccent,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

@Composable
private fun RateGroup(
    title: String,
    lines: List<String>
) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            color = GreenPale
        )
        lines.forEach { line ->
            Text(
                text = "•  $line",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
private fun UnitSelectorButton(
    unit: SurveyUnit,
    label: String,
    onClick: () -> Unit,
    testTag: String
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(8.dp),
        color = Color(0xFF000000),
        border = BorderStroke(1.dp, DarkBorder),
        modifier = Modifier
            .fillMaxWidth()
            .testTag(testTag)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(label, style = MaterialTheme.typography.labelSmall, color = TextMuted, fontSize = 10.sp)
                Text(
                    text = "${unit.name} (${unit.symbol})",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    maxLines = 1
                )
            }
            Icon(
                Icons.Default.ArrowDropDown,
                contentDescription = null,
                tint = GreenSoft,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}


