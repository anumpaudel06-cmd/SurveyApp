import 'dart:math' as math;
import '../constants/survey_constants.dart';
import '../models/area_point.dart';

class AreaEngine {
  /// Calculates enclosed area and perimeter of a polygon using the Shoelace formula.
  static LandAreaResult calculatePolygonArea(List<AreaPoint> points) {
    if (points.length < 3) {
      return fromSqMeters(0.0, 0.0);
    }

    final n = points.length;
    double shoelaceSum = 0.0;
    double perimeter = 0.0;

    for (int i = 0; i < n; i++) {
      final j = (i + 1) % n;
      final p1 = points[i];
      final p2 = points[j];

      shoelaceSum += (p1.x * p2.y) - (p2.x * p1.y);
      perimeter += math.sqrt(math.pow(p2.x - p1.x, 2) + math.pow(p2.y - p1.y, 2));
    }

    final areaSqMeters = (shoelaceSum.abs()) * 0.5;
    return fromSqMeters(areaSqMeters, perimeter);
  }

  static LandAreaResult fromSqMeters(double sqM, [double perimeterMeters = 0.0]) {
    final safeSqM = sqM < 0 ? 0.0 : sqM;
    final sqFt = safeSqM * SurveyConstants.sqmToSqft;
    final perimeterFt = perimeterMeters * 3.28084;
    return _decomposeArea(safeSqM, sqFt, perimeterMeters, perimeterFt);
  }

  static LandAreaResult fromSqFeet(double sqFt) {
    final safeSqFt = sqFt < 0 ? 0.0 : sqFt;
    final sqM = safeSqFt * SurveyConstants.sqftToSqm;
    return _decomposeArea(sqM, safeSqFt, 0.0, 0.0);
  }

  static LandAreaResult fromRopaniSubunits(double r, double a, double p, double d) {
    final totalSqFt = (r * SurveyConstants.sqftPerRopani) +
        (a * SurveyConstants.sqftPerAana) +
        (p * SurveyConstants.sqftPerPaisa) +
        (d * SurveyConstants.sqftPerDaam);
    final sqM = totalSqFt * SurveyConstants.sqftToSqm;
    return _decomposeArea(sqM, totalSqFt, 0.0, 0.0);
  }

  static LandAreaResult fromBighaSubunits(double b, double k, double dh) {
    final totalSqFt = (b * SurveyConstants.sqftPerBigha) +
        (k * SurveyConstants.sqftPerKattha) +
        (dh * SurveyConstants.sqftPerDhur);
    final sqM = totalSqFt * SurveyConstants.sqftToSqm;
    return _decomposeArea(sqM, totalSqFt, 0.0, 0.0);
  }

  static LandAreaResult _decomposeArea(
    double sqM,
    double sqFt,
    double perimeterMeters,
    double perimeterFeet,
  ) {
    // Bigha System decomposition
    final decimalBigha = sqFt / SurveyConstants.sqftPerBigha;
    final bighaInt = decimalBigha.floor();
    final remB1 = sqFt - (bighaInt * SurveyConstants.sqftPerBigha);

    final decimalKattha = remB1 / SurveyConstants.sqftPerKattha;
    final katthaInt = decimalKattha.floor();
    final remB2 = remB1 - (katthaInt * SurveyConstants.sqftPerKattha);

    final dhurDouble = remB2 / SurveyConstants.sqftPerDhur;
    final bkdFormatted = "$bighaInt Bigha, $katthaInt Kattha, ${dhurDouble.toStringAsFixed(2)} Dhur";

    // Ropani System decomposition
    final decimalRopani = sqFt / SurveyConstants.sqftPerRopani;
    final ropaniInt = decimalRopani.floor();
    final remR1 = sqFt - (ropaniInt * SurveyConstants.sqftPerRopani);

    final decimalAana = remR1 / SurveyConstants.sqftPerAana;
    final aanaInt = decimalAana.floor();
    final remR2 = remR1 - (aanaInt * SurveyConstants.sqftPerAana);

    final decimalPaisa = remR2 / SurveyConstants.sqftPerPaisa;
    final paisaInt = decimalPaisa.floor();
    final remR3 = remR2 - (paisaInt * SurveyConstants.sqftPerPaisa);

    final daamDouble = remR3 / SurveyConstants.sqftPerDaam;
    final rapdFormatted = "$ropaniInt Ropani, $aanaInt Aana, $paisaInt Paisa, ${daamDouble.toStringAsFixed(2)} Daam";

    final hectares = sqM / SurveyConstants.sqmPerHectare;
    final acres = sqFt / SurveyConstants.sqftPerAcre;

    return LandAreaResult(
      sqMeters: sqM,
      sqFeet: sqFt,
      perimeterMeters: perimeterMeters,
      perimeterFeet: perimeterFeet,
      decimalBigha: decimalBigha,
      bighaInt: bighaInt,
      katthaInt: katthaInt,
      dhurDouble: dhurDouble,
      bkdFormatted: bkdFormatted,
      decimalRopani: decimalRopani,
      ropaniInt: ropaniInt,
      aanaInt: aanaInt,
      paisaInt: paisaInt,
      daamDouble: daamDouble,
      rapdFormatted: rapdFormatted,
      hectares: hectares,
      acres: acres,
    );
  }
}
