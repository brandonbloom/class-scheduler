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

//TODO: Support weekends
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

$(function() {
    var templates = $('#templates');
    var courseTemplate = $(templates).children('.course');
    var sectionTypeTemplate = $('.sectionType', templates);
    var sectionListTemplate = $('.sections', templates);
    var sectionTemplate = $('.section', templates);
    var occuranceTemplate = $('.occurance', templates);

    var scheduler = $('#scheduler');
    var courseList = $('#courseList', scheduler);
    var calendar = $('#calendar');

    var timeHeight = function(time) {
        return time * 55;
    };
    var setTimeTop = function(element, time) {
        element.css('margin-top',
                    timeHeight(time) + 'px');
    }

    for (var hour = 0; hour < 24; hour++) {
        // Hour markers
        var time = $('<div class="time">' +
                     hour + ':00' +
                     '</div>');
        setTimeTop(time, hour);
        $('td.times .container').append(time);
        // Horizontal rules
        for (var dayIndex in DAYS) {
            var day = DAYS[dayIndex];
            var dayCell = $('td.day.' + day);
            var container = $('.' + day + ' .container');
            var hourRule = $('<div class="hour"/>');
            setTimeTop(hourRule, hour);
            container.append(hourRule);
            var halfHourRule = $('<div class="halfHour"/>');
            setTimeTop(halfHourRule, hour + 0.5);
            container.append(halfHourRule);
        }
    }

    $.fn.bindHighlighting = function(settings) {
        var elements = $(settings.selector, this);
        elements.each(function() {
            var value = $(this).data(settings.key);
            if (value) {
                $(this).mouseenter(function() {
                    elements.show()
                    .each(function() {
                        if ($(this).data(settings.key) == value) {
                            $(this).addClass(settings.cls);
                        }
                    });
                }).mouseleave(function() {
                    elements.removeClass(settings.cls);
                });
            }
        });
        return this;
    };

    var addCourse = function(course) {
        // Course
        var newCourse = courseTemplate.clone();
        newCourse.data('course', course);
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
                newSection.data('section', section);
                var sectionTypeName = 'section_type_' + course.id +
                                      '_' + sectionTypeIndex;
                var sectionId = 'section_' + course.id + '_' + section.id;
                newSection.children('input')
                    .attr('name', sectionTypeName)
                    .attr('id', sectionId);
                newSection.children('label') // TODO: section.id is for debug
                    .text(section.number + ' (' + section.id + ')')
                    .attr('for', sectionId);
                newSectionList.append(newSection)
                occurances = [];
                for (var dayIndex in section.days) {
                    // Occurance
                    var day = section.days[dayIndex];
                    var newOccurance = occuranceTemplate.clone();
                    newOccurance.data('course', course);
                    newOccurance.data('section', section);
                    newOccurance.children('.subject').text(course.subject);
                    newOccurance.children('.course').text(course.number);
                    newOccurance.children('.section').text(section.number);
                    setTimeTop(newOccurance, section.start);
                    var duration = Math.max(0.5, section.end - section.start);
                    newOccurance.css('height', timeHeight(duration));
                    //TODO: NEXT LINE IS A TEMPORARY HACK FOR CONFLICTS
                    newOccurance.css('margin-left',
                                     (course.id - 1) * 25 + 'px');
                    $('td.day.' + day + ' .container').append(newOccurance);
                    occurances.push(newOccurance);
                    allOccurances.push(newOccurance);
                }
            }
            if (sectionTypeCount > 1) {
                // Section Type
                var newSectionType = sectionTypeTemplate.clone();
                newSectionType.children('.name').text(sectionType);
                if (sections.length > 1) {
                    newSectionType.append(newSectionList);
                } else {
                    newSectionType.data('section', sections[0]);
                }
                newCourse.append(newSectionType);
            } else if (sections.length > 1) {
                newCourse.append(newSectionList);
            } else {
                newCourse.data('section', sections[0]);
            }
            sectionTypeIndex++;
        }
        // Course Events
        $('.remove', newCourse).click(function() {
            courses.splice(courses.indexOf(course), 1);
            $(this).closest('.course').slideUp(300, function() {
                $(this).remove();
            });
            for (var occuranceIndex in allOccurances) {
                allOccurances[occuranceIndex].remove();
            }
        });
        courseList.append(newCourse);
    };

    for (var i in courses) {
        addCourse(courses[i]);
    }

    scheduler.bindHighlighting({
        selector: 'div.course, .occurance',
        key: 'course',
        cls: 'active'
    }).bindHighlighting({
        selector: 'div.course, div.section, .sectionType, .occurance',
        key: 'section',
        cls: 'targeted'
    });

    $('*', scheduler).each(function() {
        var course = $(this).data('course');
        if (course) {
            //TODO: NEXT LINE IS A HACK, WILL NEED TO SELECT AN UNUSED COLOR.
            courseColor = 'color' + (course.id - 1)
            $(this).addClass(courseColor);
        }
    });

    var selectSection = function(section, selected) {
        $('.occurance', calendar).each(function () {
            if (section == $(this).data('section')) {
                if (selected) {
                    $(this).addClass('selected');
                } else {
                    $(this).removeClass('selected');
                }
            }
        });
    };

    $('.course .checkbox', courseList).change(function() {
        var course = $(this).parent().data('course');
        if ($(this).attr('checked')) {
            var courseElement = $(this).parent();
            $('.radio', courseElement).change();
            $('.sectionType', courseElement).andSelf().each(function() {
                var section = $(this).data('section');
                if (section) {
                    selectSection(section, true);
                }
            });
        } else {
            $('.occurance', calendar).each(function() {
                if (course == $(this).data('course')) {
                    $(this).removeClass('selected');
                }
            });
        }
    });

    $('.course .radio', courseList).change(function() {
        $('div.section', $(this).closest('.sections')).each(function() {
            var section = $(this).data('section');
            var selected = $('.radio', this).attr('checked');
            if (selected) {
                $(this).closest('.course').children('.checkbox').each(
                    function() {
                        var courseSelected = $(this).attr('checked');
                        if (!courseSelected) {
                            $(this).attr('checked', true)
                                   .triggerHandler('change');
                        }
                   });
            }
            selectSection(section, selected);
        });
    });

    $('.scroller', calendar).scrollTop(timeHeight(7.75));
});
