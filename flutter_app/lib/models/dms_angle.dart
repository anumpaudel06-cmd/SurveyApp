import 'dart:math' as math;

class DmsAngle {
  final int degrees;
  final int minutes;
  final double seconds;

  const DmsAngle({
    this.degrees = 0,
    this.minutes = 0,
    this.seconds = 0.0,
  });

  static const DmsAngle zero = DmsAngle();

  double get decimalDegrees {
    final sign = degrees < 0 ? -1.0 : 1.0;
    return (degrees.abs() + minutes / 60.0 + seconds / 3600.0) * sign;
  }

  double get radians => decimalDegrees * math.pi / 180.0;

  String toFormattedString([bool includeSymbols = true]) {
    final secStr = seconds % 1.0 == 0.0
        ? seconds.toInt().toString().padLeft(2, '0')
        : seconds.toStringAsFixed(1).padLeft(4, '0');
    if (includeSymbols) {
      return "$degrees° ${minutes.toString().padLeft(2, '0')}' $secStr\"";
    } else {
      return "$degrees-${minutes.toString().padLeft(2, '0')}-$secStr";
    }
  }

  static DmsAngle fromDecimal(double decimal) {
    var normalized = decimal % 360.0;
    if (normalized < 0) normalized += 360.0;
    final deg = normalized.floor();
    final remMin = (normalized - deg) * 60.0;
    final min = remMin.floor();
    final sec = (remMin - min) * 60.0;
    final roundedSec = (sec * 10000.0).round() / 10000.0;
    if (roundedSec >= 60.0) {
      return fromDecimal(deg + (min + 1) / 60.0);
    }
    return DmsAngle(degrees: deg, minutes: min, seconds: roundedSec);
  }

  static DmsAngle fromRadians(double rad) {
    return fromDecimal(rad * 180.0 / math.pi);
  }

  static DmsAngle parse(String input) {
    final clean = input.trim();
    if (clean.isEmpty) return zero;

    final numVal = double.tryParse(clean);
    if (numVal != null) return fromDecimal(numVal);

    final sanitized = clean
        .replaceAll('°', ' ')
        .replaceAll("'", ' ')
        .replaceAll('"', ' ')
        .replaceAll('d', ' ')
        .replaceAll('m', ' ')
        .replaceAll('s', ' ')
        .replaceAll(':', ' ')
        .replaceAll('-', ' ')
        .trim();

    final parts = sanitized.split(RegExp(r'\s+')).where((e) => e.isNotEmpty).toList();
    try {
      if (parts.length == 1) return fromDecimal(double.parse(parts[0]));
      if (parts.length == 2) return DmsAngle(degrees: int.parse(parts[0]), minutes: int.parse(parts[1]));
      if (parts.length >= 3) {
        return DmsAngle(
          degrees: int.parse(parts[0]),
          minutes: int.parse(parts[1]),
          seconds: double.parse(parts[2]),
        );
      }
    } catch (_) {}
    return zero;
  }
}
