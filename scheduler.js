var courses = [
    {
        'id' : 1,
        'subject' : 'BIO',
        'number' : '101',
        'name' : 'Introduction to Biology',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 1,
                    'number' : 'A',
                    'instructor' : 'Michael M. Oconner',
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 9,
                    'end' : 10
                },
                {
                    'id' : 2,
                    'number' : 'B',
                    'instructor' : 'Sandra E. Caba',
                    'days' : ['tuesday', 'thursday'],
                    'start' : 12,
                    'end' : 13.5
                }
            ],
            'Lab' : [
                {
                    'id' : 3,
                    'number' : '001',
                    'instructor' : 'Paul J. Parker',
                    'days' : ['monday'],
                    'start' : 10,
                    'end' : 12
                },
                {
                    'id' : 4,
                    'number' : '002',
                    'instructor' : 'Paul J. Parker',
                    'days' : ['tuesday'],
                    'start' : 9,
                    'end' : 11
                },
                {
                    'id' : 5,
                    'number' : '003',
                    'instructor' : 'Paul J. Parker',
                    'days' : ['monday'],
                    'start' : 13,
                    'end' : 15
                },
                {
                    'id' : 6,
                    'number' : '004',
                    'instructor' : 'Paul J. Parker',
                    'days' : ['friday'],
                    'start' : 10,
                    'end' : 12
                },
            ]
        }
    },
    {
        'id' : 2,
        'subject' : 'MATH',
        'number' : '101',
        'name' : 'Introduction to Calculus',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 7,
                    'number' : 'A',
                    'instructor' : 'Frank B. Sandifer',
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 9,
                    'end' : 10
                },
            ],
            'Recitation' : [
                {
                    'id' : 8,
                    'number' : '001',
                    'instructor' : 'Kenneth M. Lowry',
                    'days' : ['monday'],
                    'start' : 10,
                    'end' : 11
                },
                {
                    'id' : 9,
                    'number' : '002',
                    'instructor' : 'Kenneth M. Lowry',
                    'days' : ['monday'],
                    'start' : 11,
                    'end' : 12
                },
                {
                    'id' : 10,
                    'number' : '003',
                    'instructor' : 'Corey M. Berg',
                    'days' : ['tuesday'],
                    'start' : 14,
                    'end' : 15
                },
            ]
        }
    },
    {
        'id' : 3,
        'subject' : 'CS',
        'number' : '151',
        'name' : 'Comptuer Programming I',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 11,
                    'number' : 'A',
                    'instructor' : 'Pablo L. Enoch',
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 14,
                    'end' : 15
                },
                {
                    'id' : 12,
                    'number' : 'B',
                    'instructor' : 'Pablo L. Enoch',
                    'days' : ['monday', 'wednesday', 'friday'],
                    'start' : 15,
                    'end' : 16
                }
            ]
        }
    },
    {
        'id' : 4,
        'subject' : 'CS',
        'number' : '152',
        'name' : 'Comptuer Programming 2',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 13,
                    'number' : 'A',
                    'instructor' : 'Pablo L. Enoch',
                    'days' : ['thursday'],
                    'start' : 9,
                    'end' : 12
                },
            ]
        }
    }
];

function attrCount(obj) {
    var i = 0;
    for (var attr in obj) {
        i += 1;
    }
    return i;
}

$(function() {
    var courseList = $('#courseList');
    var templates = $('#templates');
    var courseTemplate = $(templates).children('.course');
    var sectionTypeTemplate = $('.sectionType', templates);
    var sectionListTemplate = $('.sections', templates);
    var sectionTemplate = $('.section', templates);
    var occuranceTemplate = $('.occurance', templates);

    var timeHeight = function(time) {
        return time * 55;
    };
    var baseTop = timeHeight(8);
    var setTimeTop = function(element, time) {
        element.css('margin-top',
                    timeHeight(time) - baseTop + 'px');
    }

    // Time markers
    for (var hour = 8; hour < 19; hour++) {
        for (var partialHour = 0.0; partialHour < 1.0; partialHour += 0.5) {
            var time = $('<div class="time">' +
                         hour + ':' + partialHour * 60 +
                         '</div>');
            setTimeTop(time, hour + partialHour);
            $('td.times').append(time);
        }
    }

    var addSectionEvents = function(section, occurances) {
        section.mouseenter(function() {
            $(this).addClass('targeted');
            for (var occuranceIndex in occurances) {
                occurances[occuranceIndex].addClass('targeted');
            }
        }).mouseleave(function() {
            $(this).removeClass('targeted');
            for (var occuranceIndex in occurances) {
                occurances[occuranceIndex].removeClass('targeted');
            }
        })
    };

    var addCourse = function(course) {
        // Course
        var newCourse = courseTemplate.clone();
        var sectionTypeCount = attrCount(course.sections);
        newCourse.children('.subject').text(course.subject);
        newCourse.children('.name').text(course.name);
        newCourse.children('.number').text(course.number);
        var sectionTypeCount = attrCount(course.sections);
        var allOccurances = [];
        var sectionTypeIndex = 0;
        var occurances;
        for (var sectionType in course.sections) {
            // Section List
            var sections = course.sections[sectionType];
            var newSectionList = sectionListTemplate.clone();
            for (var sectionIndex in sections) {
                // Section
                var section = sections[sectionIndex];
                var newSection = sectionTemplate.clone();
                var sectionTypeName = 'section_type_' + course.id +
                                      '_' + sectionTypeIndex;
                var sectionId = 'section_' + course.id + '_' + section.id;
                newSection.children('input')
                    .attr('name', sectionTypeName)
                    .attr('id', sectionId);
                newSection.children('label')
                    .text(section.number)
                    .attr('for', sectionId);
                newSectionList.append(newSection)
                occurances = [];
                for (var dayIndex in section.days) {
                    // Occurance
                    var day = section.days[dayIndex];
                    var newOccurance = occuranceTemplate.clone();
                    newOccurance.children('.subject').text(course.subject);
                    newOccurance.children('.course').text(course.number);
                    newOccurance.children('.section').text(section.number);
                    setTimeTop(newOccurance, section.start);
                    var duration = Math.max(0.5, section.end - section.start);
                    newOccurance.css('height', timeHeight(duration));
                    //TODO: NEXT LINE IS A TEMPORARY HACK FOR CONFLICTS
                    newOccurance.css('margin-left',
                                     (course.id - 1) * 25 + 'px');
                    $('td.day.' + day).append(newOccurance);
                    occurances.push(newOccurance);
                    allOccurances.push(newOccurance);
                }
                // Section events
                addSectionEvents(newSection, occurances);
            }
            if (sectionTypeCount > 1) {
                // Section Type
                var newSectionType = sectionTypeTemplate.clone();
                newSectionType.children('.name').text(sectionType);
                if (sections.length > 1) {
                    newSectionType.append(newSectionList);
                } else {
                    addSectionEvents(newSectionType, occurances);
                }
                newCourse.append(newSectionType);

            } else if (sections.length > 1) {
                newCourse.append(newSectionList);
            } else {
                addSectionEvents(newCourse, occurances);
            }
            sectionTypeIndex++;
        }
        // Course Events
        $('.remove', newCourse).click(function() {
            courses.splice(courses.indexOf(course), 1);
            $(this).parents('.course').remove();
            for (var occuranceIndex in allOccurances) {
                allOccurances[occuranceIndex].remove();
            }
        });
        newCourse.mouseenter(function() {
            $(this).addClass('active');
            for (var occuranceIndex in allOccurances) {
                allOccurances[occuranceIndex].addClass('active');
            }
        })
        .mouseleave(function() {
            $(this).removeClass('active');
            for (var occuranceIndex in allOccurances) {
                allOccurances[occuranceIndex].removeClass('active');
            }
        });
        courseList.append(newCourse);
    };

    for (var i in courses) {
        addCourse(courses[i]);
    }
});
