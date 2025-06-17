// platform-integration.js
// Bridge between Find.Me platform and value delivery system
// Displays pattern recognition insights to users immediately after session completion

import { PatternRecognitionEngine } from './pattern-recognition.js';

class FindMePlatformIntegration {
    constructor() {
        this.patternEngine = new PatternRecognitionEngine();
        this.isEnabled = true;
        this.debug = false; // Set to true for console logging
    }

    /**
     * Main integration point - called from platform's completeSession()
     * @param {Object} sessionData - Complete session data from platform
     * @returns {Promise<Object>} Analysis results or null if failed
     */
    async processSession(sessionData) {
        if (!this.isEnabled) {
            this.log('Value delivery disabled, skipping analysis');
            return null;
        }

        try {
            this.log('🔍 Starting value delivery processing...', sessionData.sessionId);
            
            // Validate input data
            if (!this.validateSessionData(sessionData)) {
                throw new Error('Invalid session data provided');
            }

            // Run pattern analysis
            const analysis = this.patternEngine.analyzeUserResponses(sessionData.responses);
            
            // Generate user-friendly insights
            const insights = this.generateInsights(analysis);
            
            // Display insights to user
            this.displayInsights(insights, analysis);
            
            // Log success
            this.log('✅ Value delivery completed successfully', {
                userType: analysis.userType,
                authenticityScore: Math.round(analysis.authenticityScore * 100) + '%',
                confidence: analysis.confidence.overall
            });

            return { analysis, insights };

        } catch (error) {
            console.error('Value delivery failed:', error);
            this.displayFallback();
            return null;
        }
    }

    /**
     * Validate session data has required structure
     * @param {Object} sessionData 
     * @returns {boolean}
     */
    validateSessionData(sessionData) {
        if (!sessionData || !sessionData.responses) {
            this.log('❌ Missing sessionData or responses');
            return false;
        }

        const responseCount = Object.keys(sessionData.responses).length;
        if (responseCount < 3) {
            this.log('❌ Insufficient responses for analysis:', responseCount);
            return false;
        }

        // Check for key responses that drive insights
        const keyResponses = ['response1', 'response4', 'response6'];
        const hasKeyResponses = keyResponses.some(key => 
            sessionData.responses[key] && sessionData.responses[key].trim().length > 10
        );

        if (!hasKeyResponses) {
            this.log('❌ Missing substantial responses for key questions');
            return false;
        }

        return true;
    }

    /**
     * Transform pattern analysis into user-friendly insights
     * @param {Object} analysis - Results from pattern recognition
     * @returns {Object} User-friendly insights
     */
    generateInsights(analysis) {
        const userTypeNames = {
            unmotivatedAchiever: 'Unmotivated Achiever',
            alternativeLearner: 'Alternative Learner',
            successfulDrifter: 'Successful Drifter'
        };

        const energyIcons = {
            people: '👥',
            problems: '🧩', 
            creativity: '🎨',
            learning: '📚'
        };

        const strengthIcons = {
            communication: '💬',
            analytical: '📊',
            creative: '🎨',
            leadership: '👑',
            problemSolving: '🔧',
            execution: '⚡'
        };

        const valueIcons = {
            impact: '🎯',
            freedom: '🕊️',
            growth: '🌱',
            security: '🛡️',
            connection: '🤝'
        };

        const userTypeName = userTypeNames[analysis.userType] || 'Unique Profile';
        const authenticityScore = Math.round(analysis.authenticityScore * 100);
        const primaryEnergizer = analysis.patterns.energy.primaryEnergizer;
        const topStrength = analysis.patterns.strengths.topStrengths[0]?.strength || 'analytical';
        const topValue = analysis.patterns.values.topValues[0]?.value || 'growth';

        return {
            headline: `You're ${userTypeName === 'Unmotivated Achiever' ? 'an' : 'a'} ${userTypeName}`,
            subtitle: `${authenticityScore}% authenticity alignment`,
            
            topInsights: [
                {
                    icon: energyIcons[primaryEnergizer] || '⚡',
                    title: `Energy Source: ${primaryEnergizer.charAt(0).toUpperCase() + primaryEnergizer.slice(1)}`,
                    description: `You're most energized by ${primaryEnergizer}-focused work`,
                    score: Math.round(analysis.patterns.energy.sustainability * 100),
                    scoreLabel: 'Sustainable'
                },
                {
                    icon: strengthIcons[topStrength] || '💪',
                    title: `Top Strength: ${topStrength.charAt(0).toUpperCase() + topStrength.slice(1)}`,
                    description: `Your standout strength is ${topStrength} work`,
                    score: Math.round(analysis.patterns.strengths.utilization * 100),
                    scoreLabel: 'Utilized'
                },
                {
                    icon: valueIcons[topValue] || '🧭',
                    title: `Core Value: ${topValue.charAt(0).toUpperCase() + topValue.slice(1)}`,
                    description: `Your driving value is ${topValue}`,
                    score: Math.round(analysis.patterns.values.alignment * 100),
                    scoreLabel: 'Aligned'
                }
            ],

            quickActions: this.generateQuickActions(analysis),
            
            confidence: analysis.confidence.overall,
            readinessScore: analysis.patterns.growth.readiness
        };
    }

    /**
     * Generate immediate action recommendations
     * @param {Object} analysis 
     * @returns {Object} Quick actions
     */
    generateQuickActions(analysis) {
        const actions = {
            start: { icon: '🚀', action: '', reason: '' },
            stop: { icon: '🛑', action: '', reason: '' },
            explore: { icon: '🔍', action: '', reason: '' }
        };

        // Start recommendation based on top strength
        const topStrength = analysis.patterns.strengths.topStrengths[0]?.strength;
        if (topStrength === 'analytical') {
            actions.start.action = 'Seek out data analysis projects';
            actions.start.reason = 'Your analytical strength is underutilized';
        } else if (topStrength === 'communication') {
            actions.start.action = 'Volunteer to present or teach';
            actions.start.reason = 'Your communication skills need more expression';
        } else {
            actions.start.action = `Focus more on ${topStrength} work`;
            actions.start.reason = 'This aligns with your natural strengths';
        }

        // Stop recommendation based on authenticity gaps
        if (analysis.patterns.authenticity.gaps > 0.5) {
            actions.stop.action = 'Following others\' expectations without question';
            actions.stop.reason = 'High authenticity gap detected';
        } else if (analysis.patterns.energy.sustainability < 0.4) {
            actions.stop.action = 'Accepting energy-draining responsibilities';
            actions.stop.reason = 'Your current situation is unsustainable';
        } else {
            actions.stop.action = 'Postponing growth opportunities';
            actions.stop.reason = 'You\'re ready for more challenge';
        }

        // Explore recommendation based on user type and readiness
        if (analysis.userType === 'alternativeLearner') {
            actions.explore.action = 'Non-traditional career paths';
            actions.explore.reason = 'Your innovative thinking needs expression';
        } else if (analysis.patterns.growth.readiness > 0.6) {
            actions.explore.action = 'Leadership or mentoring opportunities';
            actions.explore.reason = 'High growth readiness detected';
        } else {
            actions.explore.action = 'Skills development in your strength areas';
            actions.explore.reason = 'Build on what you do best';
        }

        return actions;
    }

    /**
     * Display insights to user in the completion screen
     * @param {Object} insights 
     * @param {Object} analysis 
     */
    displayInsights(insights, analysis) {
        const completionScreen = document.querySelector('#session-completed') || 
                                document.querySelector('.completion') ||
                                document.querySelector('#completion') ||
                                document.body;

        // Create insights container
        const insightsContainer = document.createElement('div');
        insightsContainer.className = 'findme-insights';
        insightsContainer.innerHTML = this.generateInsightsHTML(insights);

        // Add CSS if not already present
        if (!document.getElementById('findme-insights-styles')) {
            this.addInsightsStyles();
        }

        // Insert insights at the beginning of completion screen
        completionScreen.insertBefore(insightsContainer, completionScreen.firstChild);

        // Add expand/collapse functionality
        this.addInteractivity();

        this.log('💡 Insights displayed to user');
    }

    /**
     * Generate HTML for insights display
     * @param {Object} insights 
     * @returns {string} HTML content
     */
    generateInsightsHTML(insights) {
        return `
            <div class="insights-header">
                <h2 class="insights-title">🎉 Your Discovery Results</h2>
                <div class="insights-headline">
                    <div class="headline-text">${insights.headline}</div>
                    <div class="headline-score">${insights.subtitle}</div>
                </div>
            </div>

            <div class="insights-grid">
                ${insights.topInsights.map(insight => `
                    <div class="insight-card">
                        <div class="insight-header">
                            <span class="insight-icon">${insight.icon}</span>
                            <span class="insight-title">${insight.title}</span>
                            <span class="insight-score">${insight.score}% ${insight.scoreLabel}</span>
                        </div>
                        <p class="insight-description">${insight.description}</p>
                    </div>
                `).join('')}
            </div>

            <div class="quick-actions">
                <h3>🎯 Immediate Actions</h3>
                <div class="actions-grid">
                    <div class="action-card start">
                        <div class="action-header">
                            <span class="action-icon">${insights.quickActions.start.icon}</span>
                            <span class="action-label">Start</span>
                        </div>
                        <div class="action-content">
                            <div class="action-title">${insights.quickActions.start.action}</div>
                            <div class="action-reason">${insights.quickActions.start.reason}</div>
                        </div>
                    </div>
                    
                    <div class="action-card stop">
                        <div class="action-header">
                            <span class="action-icon">${insights.quickActions.stop.icon}</span>
                            <span class="action-label">Stop</span>
                        </div>
                        <div class="action-content">
                            <div class="action-title">${insights.quickActions.stop.action}</div>
                            <div class="action-reason">${insights.quickActions.stop.reason}</div>
                        </div>
                    </div>
                    
                    <div class="action-card explore">
                        <div class="action-header">
                            <span class="action-icon">${insights.quickActions.explore.icon}</span>
                            <span class="action-label">Explore</span>
                        </div>
                        <div class="action-content">
                            <div class="action-title">${insights.quickActions.explore.action}</div>
                            <div class="action-reason">${insights.quickActions.explore.reason}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="insights-footer">
                <div class="confidence-indicator">
                    <span class="confidence-label">Analysis Confidence:</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${Math.round(insights.confidence * 100)}%"></div>
                    </div>
                    <span class="confidence-score">${Math.round(insights.confidence * 100)}%</span>
                </div>
                
                <button class="explore-more-btn" onclick="this.style.display='none'; document.querySelector('.detailed-insights').style.display='block';">
                    📋 View Detailed Analysis
                </button>
            </div>

            <div class="detailed-insights" style="display: none;">
                <div class="detail-section">
                    <h4>🌱 Growth Readiness: ${Math.round(insights.readinessScore * 100)}%</h4>
                    <p>You show strong readiness for growth and development opportunities.</p>
                </div>
                <div class="next-steps">
                    <h4>📚 Recommended Next Steps</h4>
                    <ul>
                        <li>Reflect on these insights over the next week</li>
                        <li>Identify one small change you can make immediately</li>
                        <li>Consider sharing these insights with a trusted friend or mentor</li>
                        <li>Return in 30 days to track your progress</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Add CSS styles for insights display
     */
    addInsightsStyles() {
        const style = document.createElement('style');
        style.id = 'findme-insights-styles';
        style.textContent = `
            .findme-insights {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                margin: 20px 0;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .insights-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .insights-title {
                font-size: 2rem;
                margin: 0 0 15px 0;
                font-weight: 700;
            }

            .insights-headline {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 8px;
                backdrop-filter: blur(10px);
            }

            .headline-text {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .headline-score {
                font-size: 1rem;
                opacity: 0.9;
            }

            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .insight-card {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 8px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }

            .insight-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }

            .insight-icon {
                font-size: 1.5rem;
                margin-right: 10px;
            }

            .insight-title {
                font-weight: 600;
                flex: 1;
            }

            .insight-score {
                background: rgba(255,255,255,0.2);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .insight-description {
                margin: 0;
                opacity: 0.9;
                line-height: 1.5;
            }

            .quick-actions {
                margin-bottom: 30px;
            }

            .quick-actions h3 {
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }

            .actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 15px;
            }

            .action-card {
                background: rgba(255,255,255,0.15);
                padding: 20px;
                border-radius: 8px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                transition: transform 0.2s ease;
            }

            .action-card:hover {
                transform: translateY(-2px);
            }

            .action-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }

            .action-icon {
                font-size: 1.5rem;
                margin-right: 10px;
            }

            .action-label {
                font-weight: 700;
                font-size: 1.1rem;
            }

            .action-title {
                font-weight: 600;
                margin-bottom: 5px;
            }

            .action-reason {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .insights-footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }

            .confidence-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }

            .confidence-bar {
                width: 100px;
                height: 8px;
                background: rgba(255,255,255,0.2);
                border-radius: 4px;
                overflow: hidden;
            }

            .confidence-fill {
                height: 100%;
                background: rgba(255,255,255,0.8);
                transition: width 0.3s ease;
            }

            .confidence-score {
                font-weight: 600;
            }

            .explore-more-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .explore-more-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }

            .detailed-insights {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }

            .detail-section, .next-steps {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 15px;
            }

            .detail-section h4, .next-steps h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }

            .next-steps ul {
                margin: 0;
                padding-left: 20px;
            }

            .next-steps li {
                margin-bottom: 8px;
                line-height: 1.4;
            }

            @media (max-width: 768px) {
                .findme-insights {
                    padding: 20px;
                    margin: 15px 0;
                }
                
                .insights-grid {
                    grid-template-columns: 1fr;
                }
                
                .actions-grid {
                    grid-template-columns: 1fr;
                }
                
                .confidence-indicator {
                    flex-direction: column;
                    gap: 8px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Add interactive functionality
     */
    addInteractivity() {
        // Already handled in HTML with inline onclick
        // Could add more sophisticated interactions here
    }

    /**
     * Display fallback message if analysis fails
     */
    displayFallback() {
        const completionScreen = document.querySelector('#session-completed') || 
                                document.querySelector('.completion') ||
                                document.querySelector('#completion') ||
                                document.body;

        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'findme-insights-fallback';
        fallbackContainer.innerHTML = `
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3>🎉 Session Complete!</h3>
                <p>Thank you for completing your Find.Me discovery session. Your responses have been saved and you can download them below.</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Personalized insights are temporarily unavailable, but your data is safe.</p>
            </div>
        `;

        completionScreen.insertBefore(fallbackContainer, completionScreen.firstChild);
    }

    /**
     * Debug logging
     * @param {string} message 
     * @param {*} data 
     */
    log(message, data = null) {
        if (this.debug) {
            if (data) {
                console.log(`[FindMe Value Delivery] ${message}`, data);
            } else {
                console.log(`[FindMe Value Delivery] ${message}`);
            }
        }
    }

    /**
     * Enable/disable value delivery
     * @param {boolean} enabled 
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.log(`Value delivery ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Enable/disable debug logging
     * @param {boolean} debug 
     */
    setDebug(debug) {
        this.debug = debug;
        this.log(`Debug logging ${debug ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get current status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            debug: this.debug,
            version: '1.0.0',
            components: {
                patternEngine: !!this.patternEngine,
                styling: !!document.getElementById('findme-insights-styles')
            }
        };
    }
}

// Export for module use
export { FindMePlatformIntegration };

// Also make available globally for direct integration
if (typeof window !== 'undefined') {
    window.FindMeValueDelivery = new FindMePlatformIntegration();
    
    // Optional: Auto-enable debug in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.FindMeValueDelivery.setDebug(true);
    }
    
    console.log('✅ Find.Me Value Delivery System loaded and ready');
}
