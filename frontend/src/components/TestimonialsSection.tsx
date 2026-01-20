import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';

// --- TestimonialCard Component ---
const DEFAULT_IMAGE = require('../../assets/Rectangle 8756.png');
const STAR_IMAGE = require('../../assets/icons/star-03.png');

interface TestimonialCardProps {
  name: string;
  role: string;
  review: string;
  rating?: number;
  image?: any;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  review,
  rating = 5,
  image = DEFAULT_IMAGE,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 480;

  return (
    <View
      style={[
        styles.card,
        {
          width: isMobile ? width * 0.95 : 420,
          flexDirection: 'row',
        },
      ]}
    >
      <Image source={image} style={styles.image} />
      <View style={{ flex: 1, padding: 16, position: 'relative' }}>
        {/* Always show stars in top right corner for all screen sizes */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 16,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            maxWidth: 120,
            zIndex: 2,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              source={STAR_IMAGE}
              style={{
                width: 18,
                height: 18,
                tintColor: i < rating ? '#282FFB' : '#ccc',
                marginRight: i !== 4 ? 4 : 0,
              }}
              resizeMode="contain"
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 32,
          }}
        >
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>
          </View>
        </View>
        <Text style={styles.review}>{review}</Text>
      </View>
    </View>
  );
};

// --- TestimonialsSection Component ---
const testimonials = [
  {
    name: 'Marco Cornacchia',
    role: 'JEE Student',
    review: 'Absolutely stunning designs! Transformed my space beautifully with elegance.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'NEET Student',
    review: 'The best platform for exam prep. The mock tests and analytics are top-notch!',
    rating: 5,
  },
  {
    name: 'Shraddha Kapoor',
    role: 'MHT-CET Aspirant',
    review: 'Loved the user experience and the detailed solutions. Helped me boost my confidence.',
    rating: 4,
  },
  {
    name: 'Sneha Kulkarni',
    role: 'JEE Student',
    review: "Vidyank's expert guidance and AI-powered learning made a huge difference in my preparation.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <View style={{ backgroundColor: '#fff', paddingBottom: 32 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
      {testimonials.map((t, idx) => (
        <TestimonialCard
          key={idx}
          name={t.name}
          role={t.role}
          review={t.review}
          rating={t.rating}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#282FFB0D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#282FFB',
    marginVertical: 8,
    marginHorizontal: 18,
    overflow: 'hidden',
    alignItems: 'center',
    minHeight: 190,
  },
  image: {
    width: 139,
    height: 190,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  review: {
    marginTop: 12,
    fontSize: 15,
    color: '#222',
    lineHeight: 20,
  },
});

export default TestimonialsSection; 