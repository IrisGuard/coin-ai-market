

export const assessGradeReliability = (proposedGrade: string, coinData: any, marketHistory: any) => {
  console.log('🏆 Assessing grade reliability with user data...');
  
  const coinKey = `${coinData.name}_${coinData.year}`;
  const gradeData = marketHistory.gradeAnalysis.get(coinKey) || {};
  
  if (Object.keys(gradeData).length === 0) {
    return {
      confidence: 0.5,
      isRealistic: true,
      marketDistribution: null,
      warning: null
    };
  }
  
  const totalGrades: number = Object.values(gradeData).reduce((sum: number, count: any) => {
    return sum + (typeof count === 'number' ? count : Number(count) || 0);
  }, 0);
  const proposedGradeCount = Number(gradeData[proposedGrade]) || 0;
  const gradePercentage = totalGrades > 0 ? (proposedGradeCount / totalGrades) * 100 : 0;
  
  // Check for grade inflation (too many high grades)
  const highGrades = ['MS-70', 'MS-69', 'MS-68', 'PR-70', 'PR-69'];
  const highGradeCount: number = highGrades.reduce((sum, grade) => {
    const gradeCount = Number(gradeData[grade]) || 0;
    return sum + gradeCount;
  }, 0);
  const highGradePercentage = totalGrades > 0 ? (highGradeCount / totalGrades) * 100 : 0;
  
  let warning = null;
  let confidence = 0.8;
  
  if (highGradePercentage > 40 && highGrades.includes(proposedGrade)) {
    warning = 'possible_grade_inflation';
    confidence = 0.4;
  } else if (gradePercentage < 5 && gradePercentage > 0) {
    warning = 'uncommon_grade_for_coin';
    confidence = 0.6;
  }
  
  return {
    confidence,
    isRealistic: confidence > 0.5,
    gradeFrequency: gradePercentage,
    marketDistribution: Object.entries(gradeData)
      .map(([grade, count]) => ({
        grade,
        percentage: totalGrades > 0 ? ((Number(count) || 0) / totalGrades) * 100 : 0
      }))
      .sort((a, b) => b.percentage - a.percentage),
    warning,
    totalSamples: totalGrades
  };
};

