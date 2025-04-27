export const mockDoctors = [
    {
        id: 1,
        name: "Dr. Bennani Salma",
        specialty: "Cardiologist",
        description: "Experienced heart specialist with over 15 years of practice",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        ratings: [5, 4, 5, 5, 4, 5, 5, 4]
    },
    {
        id: 2,
        name: "Dr. Berrada Omar",
        specialty: "Neurologist",
        description: "Specialized in treating complex neurological conditions",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        ratings: [5, 5, 4, 5, 5, 5, 4, 5]
    },
    {
        id: 3,
        name: "Dr. Oussama Salah",
        specialty: "Pediatrician",
        description: "Dedicated to providing compassionate care for children",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        ratings: [4, 5, 5, 4, 5, 4, 5, 5]
    }
];

export const calculateRating = (ratings) => {
    if (!ratings || ratings.length === 0) return { average: 0, total: 0 };
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return { average: Number(average.toFixed(1)), total: ratings.length };
};
