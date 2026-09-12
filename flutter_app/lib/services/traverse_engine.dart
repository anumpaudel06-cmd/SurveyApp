import 'dart:math' as math;
import '../models/dms_angle.dart';
import '../models/traverse_models.dart';

class TraverseEngine {
  static (List<TraverseComputedRow>, TraverseSummary?) computeTraverse(
    List<TraverseInputRow> inputs, {
    AdjustmentRule rule = AdjustmentRule.bowditch,
    double startEasting = 1000.0,
    double startNorthing = 1000.0,
  }) {
    if (inputs.isEmpty) return (<TraverseComputedRow>[], null);

    final n = inputs.sizeOrLength;
    final computedBearings = <DmsAngle>[];

    // 1. Bearing propagation
    final initialBearing = inputs[0].initialBearing ?? DmsAngle.zero;
    computedBearings.add(initialBearing);

    for (int i = 1; i < n; i++) {
      final prevBearingDeg = computedBearings[i - 1].decimalDegrees;
      final angleDeg = inputs[i].correctedAngle.decimalDegrees;
      var nextBearingDeg = (prevBearingDeg + 180.0 + angleDeg) % 360.0;
      if (nextBearingDeg < 0.0) nextBearingDeg += 360.0;
      computedBearings.add(DmsAngle.fromDecimal(nextBearingDeg));
    }

    // 2. Raw Departure (ΔE) and Latitude (ΔN)
    final rawDeltaE = <double>[];
    final rawDeltaN = <double>[];
    double totalDistance = 0.0;

    for (int i = 0; i < n; i++) {
      final dist = inputs[i].distance;
      totalDistance += dist;
      final bearingRad = computedBearings[i].radians;
      final de = dist * math.sin(bearingRad);
      final dn = dist * math.cos(bearingRad);
      rawDeltaE.add(de);
      rawDeltaN.add(dn);
    }

    final sumDeltaE = rawDeltaE.fold(0.0, (a, b) => a + b);
    final sumDeltaN = rawDeltaN.fold(0.0, (a, b) => a + b);
    final sumAbsDeltaE = rawDeltaE.fold(0.0, (a, b) => a + b.abs());
    final sumAbsDeltaN = rawDeltaN.fold(0.0, (a, b) => a + b.abs());

    final linearMisclosure = math.sqrt(sumDeltaE * sumDeltaE + sumDeltaN * sumDeltaN);
    final relativeDenominator = (linearMisclosure > 1e-7 && totalDistance > 0.0)
        ? (totalDistance / linearMisclosure).round()
        : 0;

    var misclosureRad = math.atan2(sumDeltaE, sumDeltaN);
    if (misclosureRad < 0) misclosureRad += 2 * math.pi;
    final misclosureBearing = DmsAngle.fromRadians(misclosureRad);

    // 3. Balancing Corrections
    final corrDeltaE = <double>[];
    final corrDeltaN = <double>[];

    for (int i = 0; i < n; i++) {
      double cE;
      double cN;
      switch (rule) {
        case AdjustmentRule.bowditch:
          if (totalDistance > 0.0) {
            cE = -sumDeltaE * (inputs[i].distance / totalDistance);
            cN = -sumDeltaN * (inputs[i].distance / totalDistance);
          } else {
            cE = 0.0;
            cN = 0.0;
          }
          break;
        case AdjustmentRule.transit:
          cE = (sumAbsDeltaE > 1e-7) ? -sumDeltaE * (rawDeltaE[i].abs() / sumAbsDeltaE) : 0.0;
          cN = (sumAbsDeltaN > 1e-7) ? -sumDeltaN * (rawDeltaN[i].abs() / sumAbsDeltaN) : 0.0;
          break;
      }
      corrDeltaE.add(cE);
      corrDeltaN.add(cN);
    }

    // 4. Coordinates calculation
    final rows = <TraverseComputedRow>[];
    double currentE = startEasting;
    double currentN = startNorthing;

    double sumCorrDE = 0.0;
    double sumCorrDN = 0.0;

    for (int i = 0; i < n; i++) {
      final finalDE = rawDeltaE[i] + corrDeltaE[i];
      final finalDN = rawDeltaN[i] + corrDeltaN[i];
      sumCorrDE += finalDE;
      sumCorrDN += finalDN;

      currentE += finalDE;
      currentN += finalDN;

      rows.add(
        TraverseComputedRow(
          sn: i + 1,
          station: inputs[i].station,
          correctedAngle: inputs[i].correctedAngle,
          line: inputs[i].line,
          bearing: computedBearings[i],
          distance: inputs[i].distance,
          deltaE: rawDeltaE[i],
          deltaN: rawDeltaN[i],
          correctionDeltaE: corrDeltaE[i],
          correctionDeltaN: corrDeltaN[i],
          correctedDeltaE: finalDE,
          correctedDeltaN: finalDN,
          correctedEasting: currentE,
          correctedNorthing: currentN,
        ),
      );
    }

    final summary = TraverseSummary(
      totalPerimeter: totalDistance,
      sumDeltaE: sumDeltaE,
      sumDeltaN: sumDeltaN,
      sumCorrectedDeltaE: sumCorrDE,
      sumCorrectedDeltaN: sumCorrDN,
      linearMisclosure: linearMisclosure,
      relativePrecisionDenominator: relativeDenominator,
      misclosureBearing: misclosureBearing,
      adjustmentRule: rule,
    );

    return (rows, summary);
  }

  static List<TraverseInputRow> getSampleTraverse() {
    return [
      TraverseInputRow(
        station: 'A',
        line: 'A-B',
        correctedAngle: const DmsAngle(degrees: 88, minutes: 14, seconds: 20.0),
        distance: 125.40,
        initialBearing: const DmsAngle(degrees: 42, minutes: 30, seconds: 0.0),
      ),
      TraverseInputRow(
        station: 'B',
        line: 'B-C',
        correctedAngle: const DmsAngle(degrees: 92, minutes: 45, seconds: 10.0),
        distance: 158.20,
      ),
      TraverseInputRow(
        station: 'C',
        line: 'C-D',
        correctedAngle: const DmsAngle(degrees: 89, minutes: 10, seconds: 40.0),
        distance: 110.80,
      ),
      TraverseInputRow(
        station: 'D',
        line: 'D-E',
        correctedAngle: const DmsAngle(degrees: 94, minutes: 20, seconds: 30.0),
        distance: 142.50,
      ),
      TraverseInputRow(
        station: 'E',
        line: 'E-A',
        correctedAngle: const DmsAngle(degrees: 175, minutes: 29, seconds: 20.0),
        distance: 64.15,
      ),
    ];
  }
}

extension ListExt<T> on List<T> {
  int get sizeOrLength => length;
}
