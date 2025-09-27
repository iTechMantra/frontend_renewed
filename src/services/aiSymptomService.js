// src/services/aiSymptomService.js
import { v4 as uuidv4 } from 'uuid';

// Mock AI symptom database
const symptomDatabase = {
  // Common symptoms and their associated conditions
  symptoms: {
    'fever': ['viral infection', 'bacterial infection', 'flu', 'covid-19'],
    'headache': ['migraine', 'tension headache', 'sinusitis', 'hypertension'],
    'cough': ['common cold', 'bronchitis', 'pneumonia', 'asthma'],
    'nausea': ['gastritis', 'food poisoning', 'motion sickness', 'pregnancy'],
    'fatigue': ['anemia', 'depression', 'thyroid disorder', 'sleep disorder'],
    'chest pain': ['heart condition', 'muscle strain', 'anxiety', 'acid reflux'],
    'shortness of breath': ['asthma', 'pneumonia', 'heart condition', 'anxiety'],
    'abdominal pain': ['gastritis', 'appendicitis', 'kidney stones', 'menstrual cramps'],
    'dizziness': ['low blood pressure', 'dehydration', 'inner ear problem', 'anxiety'],
    'joint pain': ['arthritis', 'injury', 'gout', 'fibromyalgia']
  },
  
  // Condition descriptions and recommendations
  conditions: {
    'viral infection': {
      description: 'Common viral infection causing fever and body aches',
      severity: 'mild',
      recommendations: ['rest', 'stay hydrated', 'over-the-counter fever reducers'],
      urgent: false
    },
    'bacterial infection': {
      description: 'Bacterial infection that may require antibiotics',
      severity: 'moderate',
      recommendations: ['consult doctor', 'antibiotics if prescribed', 'rest'],
      urgent: false
    },
    'flu': {
      description: 'Influenza virus causing fever, cough, and body aches',
      severity: 'moderate',
      recommendations: ['rest', 'fluids', 'antiviral medication if prescribed'],
      urgent: false
    },
    'covid-19': {
      description: 'COVID-19 infection with respiratory symptoms',
      severity: 'moderate to severe',
      recommendations: ['isolate', 'monitor symptoms', 'seek medical attention if severe'],
      urgent: true
    },
    'migraine': {
      description: 'Severe headache with possible nausea and sensitivity to light',
      severity: 'moderate',
      recommendations: ['rest in dark room', 'pain medication', 'avoid triggers'],
      urgent: false
    },
    'tension headache': {
      description: 'Mild to moderate headache caused by stress or muscle tension',
      severity: 'mild',
      recommendations: ['relaxation techniques', 'over-the-counter pain relievers'],
      urgent: false
    },
    'sinusitis': {
      description: 'Inflammation of sinuses causing facial pain and congestion',
      severity: 'mild to moderate',
      recommendations: ['nasal decongestants', 'warm compresses', 'consult doctor if persistent'],
      urgent: false
    },
    'hypertension': {
      description: 'High blood pressure that can cause headaches',
      severity: 'moderate to severe',
      recommendations: ['monitor blood pressure', 'lifestyle changes', 'consult doctor'],
      urgent: true
    },
    'common cold': {
      description: 'Viral upper respiratory infection',
      severity: 'mild',
      recommendations: ['rest', 'fluids', 'symptom relief medications'],
      urgent: false
    },
    'bronchitis': {
      description: 'Inflammation of bronchial tubes causing cough',
      severity: 'moderate',
      recommendations: ['rest', 'cough suppressants', 'consult doctor if severe'],
      urgent: false
    },
    'pneumonia': {
      description: 'Infection of the lungs causing cough and breathing difficulties',
      severity: 'moderate to severe',
      recommendations: ['seek medical attention', 'antibiotics', 'rest'],
      urgent: true
    },
    'asthma': {
      description: 'Chronic respiratory condition causing breathing difficulties',
      severity: 'moderate to severe',
      recommendations: ['use inhaler', 'avoid triggers', 'seek emergency care if severe'],
      urgent: true
    },
    'gastritis': {
      description: 'Inflammation of stomach lining causing nausea and pain',
      severity: 'mild to moderate',
      recommendations: ['avoid spicy foods', 'antacids', 'consult doctor if persistent'],
      urgent: false
    },
    'food poisoning': {
      description: 'Illness caused by contaminated food',
      severity: 'mild to moderate',
      recommendations: ['stay hydrated', 'rest', 'seek medical attention if severe'],
      urgent: false
    },
    'anemia': {
      description: 'Low red blood cell count causing fatigue',
      severity: 'moderate',
      recommendations: ['iron supplements', 'consult doctor', 'dietary changes'],
      urgent: false
    },
    'depression': {
      description: 'Mental health condition causing persistent sadness and fatigue',
      severity: 'moderate to severe',
      recommendations: ['consult mental health professional', 'therapy', 'medication if prescribed'],
      urgent: false
    },
    'thyroid disorder': {
      description: 'Thyroid gland dysfunction affecting energy levels',
      severity: 'moderate',
      recommendations: ['consult doctor', 'thyroid function tests', 'medication if needed'],
      urgent: false
    },
    'heart condition': {
      description: 'Cardiovascular issues causing chest pain and breathing difficulties',
      severity: 'severe',
      recommendations: ['seek immediate medical attention', 'emergency care'],
      urgent: true
    },
    'appendicitis': {
      description: 'Inflammation of appendix causing severe abdominal pain',
      severity: 'severe',
      recommendations: ['seek immediate medical attention', 'emergency surgery'],
      urgent: true
    }
  }
};

// Analyze symptoms and return probable conditions
export const checkSymptoms = (symptoms) => {
  try {
    // Convert symptoms to lowercase for matching
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
    
    // Find matching conditions
    const matchingConditions = new Set();
    
    normalizedSymptoms.forEach(symptom => {
      if (symptomDatabase.symptoms[symptom]) {
        symptomDatabase.symptoms[symptom].forEach(condition => {
          matchingConditions.add(condition);
        });
      }
    });
    
    // Get condition details
    const results = Array.from(matchingConditions).map(condition => {
      const details = symptomDatabase.conditions[condition];
      return {
        condition,
        description: details.description,
        severity: details.severity,
        recommendations: details.recommendations,
        urgent: details.urgent,
        confidence: Math.min(90, 60 + (normalizedSymptoms.length * 10)) // Mock confidence score
      };
    });
    
    // Sort by urgency and confidence
    results.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.confidence - a.confidence;
    });
    
    return {
      success: true,
      results: results.slice(0, 5), // Return top 5 results
      disclaimer: 'This is a demo symptom checker. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.'
    };
  } catch (error) {
    console.error('Error checking symptoms:', error);
    return {
      success: false,
      error: 'Failed to analyze symptoms'
    };
  }
};

// Create a consultation visit from symptom analysis
export const createConsultationFromSymptoms = (symptoms, analysisResults) => {
  try {
    const visitData = {
      patientId: 'symptom-checker-user',
      patientName: 'Symptom Checker User',
      type: 'symptom_analysis',
      status: 'waiting',
      priority: analysisResults.some(r => r.urgent) ? 'high' : 'normal',
      symptoms: symptoms,
      analysisResults: analysisResults,
      notes: `Symptom analysis completed. Top condition: ${analysisResults[0]?.condition || 'Unknown'}`,
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      visit: visitData
    };
  } catch (error) {
    console.error('Error creating consultation from symptoms:', error);
    return {
      success: false,
      error: 'Failed to create consultation'
    };
  }
};

// Get common symptoms for suggestions
export const getCommonSymptoms = () => {
  return Object.keys(symptomDatabase.symptoms);
};

// Get symptom suggestions based on input
export const getSymptomSuggestions = (input) => {
  try {
    if (!input || input.length < 2) return [];
    
    const normalizedInput = input.toLowerCase();
    const suggestions = Object.keys(symptomDatabase.symptoms).filter(symptom =>
      symptom.toLowerCase().includes(normalizedInput)
    );
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
  } catch (error) {
    console.error('Error getting symptom suggestions:', error);
    return [];
  }
};
