var testData = [
    {
        'id' : 1,
        'subject' : {
            'abbreviation' : 'BIO',
            'name' : 'Biology'
        },
        'number' : '101',
        'name' : 'Introduction to Biology',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 1,
                    'number' : 'A',
                    'instructor' : {
                        'id' : 1,
                        'name' : 'Michael M. Oconner'
                    },
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 9,
                    'end' : 10
                },
                {
                    'id' : 2,
                    'number' : 'B',
                    'instructor' : {
                        'id' : 2,
                        'name' : 'Sandra E. Caba'
                    },
                    'days' : ['tuesday', 'thursday'],
                    'start' : 12,
                    'end' : 13.5
                }
            ],
            'Lab' : [
                {
                    'id' : 3,
                    'number' : '001',
                    'instructor' : {
                        'id' : 3,
                        'name' : 'Paul J. Parker'
                    },
                    'days' : ['monday'],
                    'start' : 10,
                    'end' : 12
                },
                {
                    'id' : 4,
                    'number' : '002',
                    'instructor' : {
                        'id' : 3,
                        'name' : 'Paul J. Parker'
                    },
                    'days' : ['tuesday'],
                    'start' : 9,
                    'end' : 11
                },
                {
                    'id' : 5,
                    'number' : '003',
                    'instructor' : {
                        'id' : 3,
                        'name' : 'Paul J. Parker'
                    },
                    'days' : ['monday'],
                    'start' : 13,
                    'end' : 15
                },
                {
                    'id' : 6,
                    'number' : '004',
                    'instructor' : {
                        'id' : 3,
                        'name' : 'Paul J. Parker'
                    },
                    'days' : ['friday'],
                    'start' : 10,
                    'end' : 12
                },
            ]
        }
    },
    {
        'id' : 2,
        'subject' : {
            'abbreviation' : 'MATH',
            'name' : 'Mathematics'
        },
        'number' : '101',
        'name' : 'Introduction to Calculus',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 7,
                    'number' : 'A',
                    'instructor' : {
                        'id' : 4,
                        'name' : 'Frank B. Sandifer'
                    },
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 9,
                    'end' : 10
                },
            ],
            'Recitation' : [
                {
                    'id' : 8,
                    'number' : '001',
                    'instructor' : {
                        'id' : 5,
                        'name' : 'Kenneth M. Lowry'
                    },
                    'days' : ['monday'],
                    'start' : 10,
                    'end' : 11
                },
                {
                    'id' : 9,
                    'number' : '002',
                    'instructor' : {
                        'id' : 5,
                        'name' : 'Kenneth M. Lowry'
                    },
                    'days' : ['monday'],
                    'start' : 11,
                    'end' : 12
                },
                {
                    'id' : 10,
                    'number' : '003',
                    'instructor' : {
                        'id' : 6,
                        'name' : 'Corey M. Berg'
                    },
                    'days' : ['tuesday'],
                    'start' : 14,
                    'end' : 15
                },
            ]
        }
    },
    {
        'id' : 3,
        'subject' : {
            'abbreviation' : 'CS',
            'name' : 'Computer Science'
        },
        'number' : '151',
        'name' : 'Comptuer Programming I',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 11,
                    'number' : 'A',
                    'instructor' : {
                        'id' : 7,
                        'name' : 'Pablo L. Enoch'
                    },
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 14,
                    'end' : 15
                },
                {
                    'id' : 12,
                    'number' : 'B',
                    'instructor' : {
                        'id' : 7,
                        'name' : 'Pablo L. Enoch'
                    },
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 15,
                    'end' : 16
                },
                {
                    'id' : 13,
                    'number' : 'C',
                    'instructor' : {
                        'id' : 7,
                        'name' : 'Pablo L. Enoch'
                    },
                    'days' : ['tuesday', 'thursday'],
                    'start' : 13,
                    'end' : 14.5
                }
            ]
        }
    },
    {
        'id' : 4,
        'subject' : {
            'abbreviation' : 'CS',
            'name' : 'Computer Science'
        },
        'number' : '152',
        'name' : 'Comptuer Programming 2',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 14,
                    'number' : 'A',
                    'instructor' : {
                        'id' : 7,
                        'name' : 'Pablo L. Enoch'
                    },
                    'days' : ['thursday'],
                    'start' : 9,
                    'end' : 12
                },
            ]
        }
    }
];
