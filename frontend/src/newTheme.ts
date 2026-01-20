// New Simple & Professional Color Theme
export const colors = {
    // Primary Brand Colors
    primary: '#4F46E5',        // Indigo - Main actions, buttons
    primaryLight: '#818CF8',   // Light indigo - Hover states
    primaryDark: '#3730A3',    // Dark indigo - Active states

    // Status Colors
    success: '#10B981',        // Green - Success, correct answers
    warning: '#F59E0B',        // Amber - Warnings, pending
    error: '#EF4444',          // Red - Errors, incorrect answers
    info: '#3B82F6',           // Blue - Information

    // Background & Surface
    background: '#F9FAFB',     // Light gray - Page background
    surface: '#FFFFFF',        // White - Cards, surfaces
    surfaceHover: '#F3F4F6',   // Very light gray - Hover state
    border: '#E5E7EB',         // Light gray - Borders
    divider: '#D1D5DB',        // Gray - Dividers

    // Text Colors
    textPrimary: '#111827',    // Almost black - Headings
    textSecondary: '#6B7280',  // Gray - Body text
    textTertiary: '#9CA3AF',   // Light gray - Hints, disabled
    textInverse: '#FFFFFF',    // White - Text on dark backgrounds

    // Exam Status Colors
    examActive: '#10B981',     // Green - Active exams
    examDraft: '#F59E0B',      // Amber - Draft exams
    examArchived: '#6B7280',   // Gray - Archived exams

    // Difficulty Colors
    difficultyEasy: '#10B981',    // Green
    difficultyMedium: '#F59E0B',  // Amber
    difficultyHard: '#EF4444',    // Red

    // Additional UI Colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Gradient (for premium feel)
    gradientStart: '#4F46E5',
    gradientEnd: '#7C3AED',
};

// Typography Scale
export const typography = {
    // Font Sizes
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    small: 14,
    tiny: 12,

    // Font Weights
    bold: '700',
    semibold: '600',
    medium: '500',
    regular: '400',

    // Line Heights
    lineHeightTight: 1.2,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.75,
};

// Spacing Scale (consistent spacing throughout app)
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Border Radius
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

// Shadows
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
};

// Animation Durations
export const animations = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// Common Component Styles
export const commonStyles = {
    // Primary Button
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    primaryButtonText: {
        color: colors.textInverse,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },

    // Secondary Button
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },

    // Card
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },

    // Input
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.body,
        color: colors.textPrimary,
    },
};

export default {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    animations,
    commonStyles,
};
