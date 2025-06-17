// pattern-recognition.js
// Core Pattern Recognition Engine for Find.Me Platform
// Analyzes user responses to identify authentic patterns and user types

export class PatternRecognitionEngine {
    constructor() {
        this.keywords = this.initializeKeywordLibrary();
        this.userTypeProfiles = this.initializeUserTypeProfiles();
    }

    // Main analysis method - processes all user responses
    analyzeUserResponses(responses) {
        console.log('🔍 Starting pattern recognition analysis...');
        
        const analysis = {
            rawResponses: responses,
            patterns: {},
            userType: null,
            authenticityScore: 0,
            confidence: {},
            metadata: {
                analyzedAt: new Date(),
                responseCount: Object.keys(responses).length,
                responseQuality: this.assessResponseQuality(responses)
            }
        };

        // Run each pattern analyzer
        analysis.patterns.energy = this.analyzeEnergyPatterns(responses);
        analysis.patterns.values = this.analyzeValuesPatterns(responses);
        analysis.patterns.strengths = this.analyzeStrengthsPatterns(responses);
        analysis.patterns.problemSolving = this.analyzeProblemSolvingStyle(responses);
        analysis.patterns.authenticity = this.analyzeAuthenticityPatterns(responses);
        analysis.patterns.growth = this.analyzeGrowthReadiness(responses);

        // Determine user type based on patterns
        analysis.userType = this.identifyUserType(responses, analysis.patterns);
        
        // Calculate overall authenticity score
        analysis.authenticityScore = this.calculateAuthenticityScore(analysis.patterns);
        
        // Generate confidence scores
        analysis.confidence = this.calculateConfidenceScores(analysis.patterns, responses);

        console.log('✅ Pattern analysis complete:', {
            userType: analysis.userType,
            authenticityScore: Math.round(analysis.authenticityScore * 100) + '%',
            confidence: analysis.confidence.overall
        });

        return analysis;
    }

    // Energy Pattern Analysis
    analyzeEnergyPatterns(responses) {
        console.log('⚡ Analyzing energy patterns...');
        
        const energyCategories = {
            people: 0,
            problems: 0,
            creativity: 0,
            learning: 0
        };

        // Analyze key responses for energy indicators
        const relevantResponses = [
            responses.response8 || '', // engagement moments
            responses.response9 || '', // energy patterns
            responses.response6 || '', // current situation
            responses.response1 || ''  // what brings you here
        ].join(' ');

        // Score each energy category
        Object.keys(energyCategories).forEach(category => {
            energyCategories[category] = this.scoreEnergyCategory(relevantResponses, category);
        });

        // Identify primary energizer
        const primaryEnergizer = Object.keys(energyCategories).reduce((a, b) => 
            energyCategories[a] > energyCategories[b] ? a : b
        );

        // Calculate sustainability score
        const sustainability = this.calculateEnergySustainability(responses);

        // Extract specific indicators
        const indicators = this.extractEnergyIndicators(relevantResponses);

        return {
            categories: energyCategories,
            primaryEnergizer,
            sustainability,
            indicators,
            confidence: this.calculateEnergyConfidence(relevantResponses)
        };
    }

    scoreEnergyCategory(text, category) {
        const keywords = this.keywords.energy[category] || [];
        const lowerText = text.toLowerCase();
        
        return keywords.reduce((score, keyword) => {
            // Count occurrences with diminishing returns
            const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
            return score + Math.min(matches, 3); // Cap at 3 to avoid over-weighting
        }, 0);
    }

    calculateEnergySustainability(responses) {
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        const energizingWords = ['energized', 'excited', 'passionate', 'love', 'enjoy', 'thrive', 'flow'];
        const drainingWords = ['drained', 'exhausted', 'frustrated', 'bored', 'tedious', 'struggle'];
        
        const energizingCount = energizingWords.filter(word => allText.includes(word)).length;
        const drainingCount = drainingWords.filter(word => allText.includes(word)).length;
        
        if (energizingCount + drainingCount === 0) return 0.5; // Neutral
        return energizingCount / (energizingCount + drainingCount);
    }

    extractEnergyIndicators(text) {
        const lowerText = text.toLowerCase();
        
        return {
            energizing: this.extractKeywordMatches(lowerText, this.keywords.energy.energizing),
            draining: this.extractKeywordMatches(lowerText, this.keywords.energy.draining),
            flow: this.extractKeywordMatches(lowerText, this.keywords.energy.flow),
            stress: this.extractKeywordMatches(lowerText, this.keywords.energy.stress)
        };
    }

    // Values Pattern Analysis
    analyzeValuesPatterns(responses) {
        console.log('🧭 Analyzing values patterns...');
        
        const valueCategories = {
            impact: 0,
            freedom: 0,
            growth: 0,
            security: 0,
            connection: 0
        };

        // Analyze responses 4 (work meaning), 11 (values in action), 6 (current situation)
        const relevantResponses = [
            responses.response4 || '',
            responses.response11 || '',
            responses.response6 || '',
            responses.response1 || ''
        ].join(' ');

        // Score each value category
        Object.keys(valueCategories).forEach(category => {
            valueCategories[category] = this.scoreValueCategory(relevantResponses, category);
        });

        // Identify top values
        const topValues = this.getTopValues(valueCategories, 3);

        // Calculate values alignment
        const alignment = this.calculateValuesAlignment(responses);

        // Identify value conflicts
        const conflicts = this.identifyValueConflicts(valueCategories, responses);

        return {
            categories: valueCategories,
            topValues,
            alignment,
            conflicts,
            confidence: this.calculateValuesConfidence(relevantResponses)
        };
    }

    scoreValueCategory(text, category) {
        const keywords = this.keywords.values[category] || [];
        const lowerText = text.toLowerCase();
        
        return keywords.reduce((score, keyword) => {
            const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
            return score + Math.min(matches, 2);
        }, 0);
    }

    getTopValues(valueCategories, count) {
        return Object.entries(valueCategories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, count)
            .map(([value, score]) => ({ value, score }));
    }

    calculateValuesAlignment(responses) {
        const workResponse = responses.response4 || '';
        const situationResponse = responses.response6 || '';
        const combinedText = (workResponse + ' ' + situationResponse).toLowerCase();
        
        const positiveWords = ['fulfilling', 'meaningful', 'aligned', 'right', 'love', 'enjoy'];
        const negativeWords = ['frustrated', 'stuck', 'wrong', 'misaligned', 'unfulfilled'];
        
        const positiveCount = positiveWords.filter(word => combinedText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => combinedText.includes(word)).length;
        
        if (positiveCount + negativeCount === 0) return 0.5;
        return positiveCount / (positiveCount + negativeCount);
    }

    identifyValueConflicts(valueCategories, responses) {
        const conflicts = [];
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        // Check for security vs freedom conflict
        if (valueCategories.security > 1 && valueCategories.freedom > 1) {
            conflicts.push({
                type: 'security-freedom',
                description: 'Tension between desire for security and freedom'
            });
        }
        
        // Check for growth vs comfort conflict
        if (valueCategories.growth > 1 && allText.includes('comfortable')) {
            conflicts.push({
                type: 'growth-comfort',
                description: 'Tension between growth aspirations and comfort zone'
            });
        }
        
        return conflicts;
    }

    // Strengths Pattern Analysis
    analyzeStrengthsPatterns(responses) {
        console.log('💪 Analyzing strengths patterns...');
        
        const strengthCategories = {
            communication: 0,
            analytical: 0,
            creative: 0,
            leadership: 0,
            problemSolving: 0,
            execution: 0
        };

        // Analyze responses 8 (engagement), 9 (energy), 10 (problem-solving)
        const relevantResponses = [
            responses.response8 || '',
            responses.response9 || '',
            responses.response10 || '',
            responses.response6 || ''
        ].join(' ');

        // Score each strength category
        Object.keys(strengthCategories).forEach(category => {
            strengthCategories[category] = this.scoreStrengthCategory(relevantResponses, category);
        });

        const topStrengths = this.getTopValues(strengthCategories, 3);
        const utilization = this.calculateStrengthUtilization(responses);

        return {
            categories: strengthCategories,
            topStrengths,
            utilization,
            confidence: this.calculateStrengthConfidence(relevantResponses)
        };
    }

    scoreStrengthCategory(text, category) {
        const keywords = this.keywords.strengths[category] || [];
        const lowerText = text.toLowerCase();
        
        return keywords.reduce((score, keyword) => {
            const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
            return score + Math.min(matches, 2);
        }, 0);
    }

    calculateStrengthUtilization(responses) {
        const situationResponse = responses.response6 || '';
        const engagementResponse = responses.response8 || '';
        const combinedText = (situationResponse + ' ' + engagementResponse).toLowerCase();
        
        const utilizationWords = ['using', 'good at', 'strong', 'excel', 'leveraging'];
        const underutilizationWords = ['not using', 'wasted', 'underutilized', 'could do more'];
        
        const utilizationCount = utilizationWords.filter(word => combinedText.includes(word)).length;
        const underutilizationCount = underutilizationWords.filter(word => combinedText.includes(word)).length;
        
        if (utilizationCount + underutilizationCount === 0) return 0.5;
        return utilizationCount / (utilizationCount + underutilizationCount);
    }

    // Problem-Solving Style Analysis
    analyzeProblemSolvingStyle(responses) {
        console.log('🧠 Analyzing problem-solving style...');
        
        const response10 = responses.response10 || '';
        const styles = {
            analytical: 0,
            experimental: 0,
            collaborative: 0,
            intuitive: 0
        };

        Object.keys(styles).forEach(style => {
            styles[style] = this.scoreProblemSolvingStyle(response10, style);
        });

        const primaryStyle = Object.keys(styles).reduce((a, b) => styles[a] > styles[b] ? a : b);
        const approach = this.determineProblemSolvingApproach(response10);

        return {
            styles,
            primaryStyle,
            approach,
            confidence: this.calculatePSConfidence(response10)
        };
    }

    scoreProblemSolvingStyle(text, style) {
        const keywords = this.keywords.problemSolving[style] || [];
        const lowerText = text.toLowerCase();
        
        return keywords.reduce((score, keyword) => {
            return score + (lowerText.includes(keyword) ? 1 : 0);
        }, 0);
    }

    determineProblemSolvingApproach(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('jump in') || lowerText.includes('try')) {
            return 'action-oriented';
        } else if (lowerText.includes('think') || lowerText.includes('plan')) {
            return 'reflection-oriented';
        } else if (lowerText.includes('discuss') || lowerText.includes('team')) {
            return 'collaboration-oriented';
        }
        
        return 'balanced';
    }

    // Authenticity Pattern Analysis
    analyzeAuthenticityPatterns(responses) {
        console.log('🎯 Analyzing authenticity patterns...');
        
        const gaps = this.calculateAuthenticityGaps(responses);
        const alignment = 1 - gaps;
        const tensions = this.identifyInternalTensions(responses);

        return {
            gaps,
            alignment,
            tensions,
            confidence: this.calculateAuthenticityConfidence(responses)
        };
    }

    calculateAuthenticityGaps(responses) {
        let gapScore = 0;
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        // Check for "should" language (external expectations)
        const shouldCount = (allText.match(/should|supposed to|expected to|ought to/g) || []).length;
        gapScore += Math.min(shouldCount * 0.1, 0.4);
        
        // Check for work meaning vs situation misalignment
        const workMeaning = responses.response4 || '';
        const currentSituation = responses.response6 || '';
        if (this.indicatesDisalignment(workMeaning, currentSituation)) {
            gapScore += 0.3;
        }
        
        // Check for energy misalignment
        const energyResponse = responses.response9 || '';
        if (this.indicatesEnergyMisalignment(energyResponse, currentSituation)) {
            gapScore += 0.3;
        }
        
        return Math.min(gapScore, 1);
    }

    indicatesDisalignment(workMeaning, currentSituation) {
        const positiveWork = this.hasPositiveLanguage(workMeaning);
        const positiveSituation = this.hasPositiveLanguage(currentSituation);
        return positiveWork && !positiveSituation;
    }

    hasPositiveLanguage(text) {
        const positiveWords = ['love', 'enjoy', 'fulfilling', 'meaningful', 'excited', 'passionate'];
        const lowerText = text.toLowerCase();
        return positiveWords.some(word => lowerText.includes(word));
    }

    indicatesEnergyMisalignment(energyResponse, situationResponse) {
        const drainingWords = ['drained', 'tired', 'exhausted', 'frustrated'];
        const combinedText = (energyResponse + ' ' + situationResponse).toLowerCase();
        return drainingWords.some(word => combinedText.includes(word));
    }

    identifyInternalTensions(responses) {
        const tensions = [];
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        // Security vs Growth tension
        if (this.hasTension(allText, ['security', 'stable'], ['growth', 'challenge'])) {
            tensions.push({
                type: 'security-growth',
                description: 'Wants both security and growth opportunities'
            });
        }
        
        // Independence vs Connection tension
        if (this.hasTension(allText, ['independent', 'autonomous'], ['team', 'collaborate'])) {
            tensions.push({
                type: 'independence-connection',
                description: 'Values both independence and collaboration'
            });
        }
        
        return tensions;
    }

    hasTension(text, keywords1, keywords2) {
        const has1 = keywords1.some(keyword => text.includes(keyword));
        const has2 = keywords2.some(keyword => text.includes(keyword));
        return has1 && has2;
    }

    // Growth Readiness Analysis
    analyzeGrowthReadiness(responses) {
        console.log('🌱 Analyzing growth readiness...');
        
        const readiness = this.assessGrowthReadiness(responses);
        const motivation = this.assessMotivationLevel(responses);
        const barriers = this.identifyGrowthBarriers(responses);

        return {
            readiness,
            motivation,
            barriers,
            confidence: this.calculateGrowthConfidence(responses)
        };
    }

    assessGrowthReadiness(responses) {
        const allText = Object.values(responses).join(' ').toLowerCase();
        let readinessScore = 0;
        
        // Change-oriented language
        const changeWords = ['change', 'different', 'new', 'transition', 'next step'];
        readinessScore += changeWords.filter(word => allText.includes(word)).length * 0.2;
        
        // Learning orientation
        const learningWords = ['learn', 'grow', 'develop', 'improve', 'skill'];
        readinessScore += learningWords.filter(word => allText.includes(word)).length * 0.15;
        
        // Dissatisfaction (motivator for change)
        const dissatisfactionWords = ['frustrated', 'stuck', 'unfulfilled', 'bored'];
        readinessScore += dissatisfactionWords.filter(word => allText.includes(word)).length * 0.25;
        
        return Math.min(readinessScore, 1);
    }

    assessMotivationLevel(responses) {
        const allText = Object.values(responses).join(' ').toLowerCase();
        let motivationScore = 0;
        
        // Action-oriented language
        const actionWords = ['will', 'going to', 'plan to', 'want to', 'ready to'];
        motivationScore += actionWords.filter(word => allText.includes(word)).length * 0.2;
        
        // Urgency indicators
        const urgencyWords = ['need to', 'have to', 'must', 'important'];
        motivationScore += urgencyWords.filter(word => allText.includes(word)).length * 0.15;
        
        // Future orientation
        const futureWords = ['future', 'goal', 'dream', 'vision', 'hope'];
        motivationScore += futureWords.filter(word => allText.includes(word)).length * 0.1;
        
        return Math.min(motivationScore, 1);
    }

    identifyGrowthBarriers(responses) {
        const barriers = [];
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        // Fear-based barriers
        if (this.hasBarrierIndicators(allText, ['afraid', 'scared', 'fear', 'worried'])) {
            barriers.push({
                type: 'fear-based',
                description: 'Fear or anxiety about change'
            });
        }
        
        // Resource barriers
        if (this.hasBarrierIndicators(allText, ['time', 'money', 'resources', 'afford'])) {
            barriers.push({
                type: 'resource-constraint',
                description: 'Limited time, money, or resources'
            });
        }
        
        // External pressure
        if (this.hasBarrierIndicators(allText, ['others expect', 'family', 'pressure'])) {
            barriers.push({
                type: 'external-pressure',
                description: 'External expectations creating pressure'
            });
        }
        
        return barriers;
    }

    hasBarrierIndicators(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    // User Type Identification
    identifyUserType(responses, patterns) {
        console.log('🔍 Identifying user type...');
        
        const typeScores = {
            unmotivatedAchiever: 0,
            alternativeLearner: 0,
            successfulDrifter: 0
        };

        const allText = Object.values(responses).join(' ').toLowerCase();

        // Unmotivated Achiever indicators
        if (this.hasTypeIndicators(responses.response1, ['capable', 'direction', 'unclear'])) {
            typeScores.unmotivatedAchiever += 2;
        }
        if (this.hasTypeIndicators(responses.response4, ['necessity', 'bills', 'have to'])) {
            typeScores.unmotivatedAchiever += 3;
        }
        if (patterns.authenticity.gaps > 0.4) {
            typeScores.unmotivatedAchiever += 1;
        }

        // Alternative Learner indicators
        if (this.hasTypeIndicators(allText, ['different', 'traditional', 'unconventional'])) {
            typeScores.alternativeLearner += 3;
        }
        if (patterns.problemSolving.primaryStyle === 'experimental' || patterns.problemSolving.primaryStyle === 'intuitive') {
            typeScores.alternativeLearner += 2;
        }
        if (this.hasTypeIndicators(responses.response3, ['process', 'time', 'space'])) {
            typeScores.alternativeLearner += 1;
        }

        // Successful Drifter indicators
        if (this.hasTypeIndicators(responses.response1, ['successful', 'good at', 'missing'])) {
            typeScores.successfulDrifter += 3;
        }
        if (this.hasTypeIndicators(responses.response6, ['doing well', 'but', 'however', 'something'])) {
            typeScores.successfulDrifter += 2;
        }
        if (patterns.authenticity.gaps > 0.6) {
            typeScores.successfulDrifter += 2;
        }

        // Return highest scoring type
        return Object.keys(typeScores).reduce((a, b) => 
            typeScores[a] > typeScores[b] ? a : b
        );
    }

    hasTypeIndicators(text, keywords) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return keywords.some(keyword => lowerText.includes(keyword));
    }

    // Overall Calculations
    calculateAuthenticityScore(patterns) {
        const factors = [
            patterns.values.alignment,
            patterns.energy.sustainability,
            patterns.strengths.utilization,
            patterns.authenticity.alignment
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    calculateConfidenceScores(patterns, responses) {
        const wordCounts = Object.values(responses).map(r => (r || '').split(' ').length);
        const avgResponseLength = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
        
        const baseConfidence = Math.min(avgResponseLength / 20, 1);
        
        return {
            overall: baseConfidence,
            energy: patterns.energy.confidence,
            values: patterns.values.confidence,
            strengths: patterns.strengths.confidence,
            authenticity: patterns.authenticity.confidence,
            growth: patterns.growth.confidence
        };
    }

    // Confidence Calculation Methods
    calculateEnergyConfidence(text) {
        const wordCount = text.split(' ').length;
        const specificityScore = this.hasSpecificExamples(text) ? 1 : 0.5;
        const lengthScore = Math.min(wordCount / 50, 1);
        return (specificityScore + lengthScore) / 2;
    }

    calculateValuesConfidence(text) {
        const valueWords = ['important', 'matters', 'priority', 'value', 'believe'];
        const hasValueLanguage = valueWords.some(word => text.toLowerCase().includes(word));
        const lengthScore = Math.min(text.split(' ').length / 80, 1);
        return hasValueLanguage ? Math.max(lengthScore, 0.7) : lengthScore;
    }

    calculateStrengthConfidence(text) {
        const confidenceWords = ['good at', 'strong', 'excel', 'naturally', 'easy'];
        const hasConfidenceLanguage = confidenceWords.some(word => text.toLowerCase().includes(word));
        return hasConfidenceLanguage ? 0.8 : 0.5;
    }

    calculatePSConfidence(text) {
        const wordCount = text.split(' ').length;
        const hasExample = this.hasSpecificExamples(text);
        const lengthScore = Math.min(wordCount / 30, 1);
        return hasExample ? Math.max(lengthScore, 0.7) : lengthScore;
    }

    calculateAuthenticityConfidence(responses) {
        const authenticityWords = ['authentic', 'true to myself', 'genuine', 'real me'];
        const allText = Object.values(responses).join(' ').toLowerCase();
        const hasAuthenticityLanguage = authenticityWords.some(word => allText.includes(word));
        return hasAuthenticityLanguage ? 0.8 : 0.6;
    }

    calculateGrowthConfidence(responses) {
        const growthWords = ['grow', 'develop', 'improve', 'learn', 'change'];
        const allText = Object.values(responses).join(' ').toLowerCase();
        const growthMentions = growthWords.filter(word => allText.includes(word)).length;
        return Math.min(growthMentions / 5, 1);
    }

    // Helper Methods
    hasSpecificExamples(text) {
        const exampleIndicators = ['when', 'example', 'like when', 'such as', 'for instance', 'time I'];
        return exampleIndicators.some(indicator => text.toLowerCase().includes(indicator));
    }

    extractKeywordMatches(text, keywords) {
        return keywords.filter(keyword => text.includes(keyword.toLowerCase()));
    }

    assessResponseQuality(responses) {
        const totalWords = Object.values(responses).join(' ').split(' ').length;
        const avgLength = totalWords / Object.keys(responses).length;
        
        if (avgLength >= 25) return 'High';
        if (avgLength >= 15) return 'Good';
        if (avgLength >= 10) return 'Moderate';
        return 'Basic';
    }

    // Initialize keyword libraries
    initializeKeywordLibrary() {
        return {
            energy: {
                people: ['people', 'team', 'collaborate', 'help', 'others', 'relationships', 'community', 'social', 'mentor', 'teach'],
                problems: ['solve', 'challenge', 'analyze', 'figure out', 'complex', 'problem', 'troubleshoot', 'fix', 'systematic'],
                creativity: ['create', 'design', 'innovative', 'ideas', 'artistic', 'build', 'imagine', 'brainstorm', 'original'],
                learning: ['learn', 'discover', 'understand', 'research', 'study', 'knowledge', 'explore', 'curious', 'absorb'],
                energizing: ['energized', 'excited', 'passionate', 'love', 'enjoy', 'thrive', 'flow', 'natural'],
                draining: ['drained', 'exhausted', 'frustrated', 'bored', 'tedious', 'struggle', 'difficult', 'hate'],
                flow: ['flow', 'lost track of time', 'absorbed', 'effortless', 'natural', 'zone', 'immersed'],
                stress: ['stressed', 'overwhelmed', 'anxious', 'pressure', 'burnt out', 'tired']
            },
            values: {
                impact: ['difference', 'meaning', 'purpose', 'help', 'contribute', 'matter', 'change', 'meaningful', 'significant'],
                freedom: ['freedom', 'autonomous', 'flexible', 'independent', 'choice', 'control', 'own pace', 'self-directed'],
                growth: ['learn', 'grow', 'develop', 'improve', 'challenge', 'evolve', 'progress', 'advance', 'expand'],
                security: ['stable', 'secure', 'predictable', 'safe', 'reliable', 'steady', 'consistent', 'guaranteed'],
                connection: ['relationships', 'team', 'community', 'together', 'support', 'collaborate', 'bond', 'social']
            },
            strengths: {
                communication: ['communicate', 'explain', 'present', 'teach', 'speak', 'write', 'articulate', 'express'],
                analytical: ['analyze', 'data', 'research', 'logical', 'systematic', 'detail', 'examine', 'investigate'],
                creative: ['creative', 'innovative', 'design', 'artistic', 'ideas', 'imaginative', 'original', 'inventive'],
                leadership: ['lead', 'manage', 'guide', 'influence', 'motivate', 'direct', 'inspire', 'coordinate'],
                problemSolving: ['solve', 'fix', 'troubleshoot', 'resolve', 'solution', 'figure out', 'address', 'tackle'],
                execution: ['implement', 'deliver', 'complete', 'organize', 'efficient', 'results', 'accomplish', 'finish']
            },
            problemSolving: {
                analytical: ['research', 'study', 'investigate', 'analyze', 'data', 'systematic', 'methodical'],
                experimental: ['try', 'experiment', 'test', 'hands-on', 'trial', 'iterate', 'prototype'],
                collaborative: ['discuss', 'team', 'brainstorm', 'input', 'feedback', 'together', 'group'],
                intuitive: ['feel', 'instinct', 'gut', 'intuition', 'sense', 'naturally', 'instinctive']
            }
        };
    }

    initializeUserTypeProfiles() {
        return {
            unmotivatedAchiever: {
                characteristics: ['capable but directionless', 'externally motivated', 'seeks purpose'],
                commonChallenges: ['lack of internal drive', 'following others\' expectations', 'imposter syndrome'],
                strengths: ['proven capability', 'strong work ethic', 'adaptability']
            },
            alternativeLearner: {
                characteristics: ['non-traditional approach', 'innovative thinking', 'questions systems'],
                commonChallenges: ['traditional environments', 'conventional expectations', 'fitting in'],
                strengths: ['creative problem-solving', 'independent thinking', 'resilience']
            },
            successfulDrifter: {
                characteristics: ['externally successful', 'feels misaligned', 'questioning path'],
                commonChallenges: ['golden handcuffs', 'fear of change', 'identity confusion'],
                strengths: ['proven success', 'high competence', 'strong network']
            }
        };
    }
}

// Export for use in other modules
export { PatternRecognitionEngine };
