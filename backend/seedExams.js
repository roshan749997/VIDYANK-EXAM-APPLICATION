const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('./models/Exam.js');
const connectDB = require('./config/db.js');

dotenv.config();

const sampleExams = [
    {
        title: 'UPSC Prelims Mock Test 2025',
        subject: 'General Studies',
        difficulty: 'Hard',
        duration: 120,
        status: 'Active',
        questions: [
            {
                text: 'Who is known as the Father of the Indian Constitution?',
                options: ['Mahatma Gandhi', 'B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
                answer: 1
            },
            {
                text: 'Which article of the Indian Constitution deals with the Right to Equality?',
                options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
                answer: 0
            },
            {
                text: 'The Preamble of the Indian Constitution was adopted on which date?',
                options: ['26 January 1950', '26 November 1949', '15 August 1947', '2 October 1948'],
                answer: 1
            },
            {
                text: 'Which of the following is NOT a Fundamental Right?',
                options: ['Right to Equality', 'Right to Property', 'Right to Freedom', 'Right against Exploitation'],
                answer: 1
            },
            {
                text: 'The President of India is elected for a term of how many years?',
                options: ['4 years', '5 years', '6 years', '7 years'],
                answer: 1
            }
        ]
    },
    {
        title: 'MPSC Prelims Practice Test',
        subject: 'Maharashtra General Knowledge',
        difficulty: 'Medium',
        duration: 90,
        status: 'Active',
        questions: [
            {
                text: 'Who was the first Chief Minister of Maharashtra?',
                options: ['Vasantrao Naik', 'Yashwantrao Chavan', 'Sharad Pawar', 'Shivajirao Patil'],
                answer: 1
            },
            {
                text: 'Which is the largest district in Maharashtra by area?',
                options: ['Pune', 'Ahmednagar', 'Nagpur', 'Thane'],
                answer: 1
            },
            {
                text: 'The Ajanta Caves are located in which district?',
                options: ['Aurangabad', 'Pune', 'Mumbai', 'Nashik'],
                answer: 0
            },
            {
                text: 'Which river is the longest in Maharashtra?',
                options: ['Krishna', 'Godavari', 'Tapi', 'Bhima'],
                answer: 1
            },
            {
                text: 'When was Maharashtra formed as a separate state?',
                options: ['1 May 1960', '15 August 1947', '26 January 1950', '1 November 1956'],
                answer: 0
            }
        ]
    },
    {
        title: 'NEET Biology Mock Test',
        subject: 'Biology',
        difficulty: 'Hard',
        duration: 180,
        status: 'Active',
        questions: [
            {
                text: 'What is the powerhouse of the cell?',
                options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
                answer: 1
            },
            {
                text: 'Which blood group is known as the universal donor?',
                options: ['A+', 'B+', 'AB+', 'O-'],
                answer: 3
            },
            {
                text: 'What is the normal pH of human blood?',
                options: ['6.5', '7.0', '7.4', '8.0'],
                answer: 2
            },
            {
                text: 'Which organ produces insulin?',
                options: ['Liver', 'Pancreas', 'Kidney', 'Spleen'],
                answer: 1
            },
            {
                text: 'How many chromosomes are present in a human cell?',
                options: ['23', '46', '48', '92'],
                answer: 1
            }
        ]
    },
    {
        title: 'General Knowledge Quiz',
        subject: 'General Knowledge',
        difficulty: 'Easy',
        duration: 30,
        status: 'Active',
        questions: [
            {
                text: 'What is the capital of India?',
                options: ['Mumbai', 'Delhi', 'New Delhi', 'Kolkata'],
                answer: 2
            },
            {
                text: 'Who is the current Prime Minister of India (as of 2025)?',
                options: ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Manmohan Singh'],
                answer: 0
            },
            {
                text: 'Which is the national animal of India?',
                options: ['Lion', 'Tiger', 'Elephant', 'Peacock'],
                answer: 1
            },
            {
                text: 'How many states are there in India?',
                options: ['28', '29', '30', '31'],
                answer: 0
            },
            {
                text: 'Which is the longest river in India?',
                options: ['Yamuna', 'Ganga', 'Brahmaputra', 'Godavari'],
                answer: 1
            }
        ]
    }
];

const seedExams = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing exams...');
        await Exam.deleteMany({});

        console.log('📝 Creating sample exams...');
        const createdExams = await Exam.insertMany(sampleExams);

        console.log(`✅ Successfully created ${createdExams.length} sample exams:`);
        createdExams.forEach((exam, index) => {
            console.log(`   ${index + 1}. ${exam.title} (${exam.questions.length} questions)`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedExams();
