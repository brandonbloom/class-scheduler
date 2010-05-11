var courses = [
    {
        'id' : 1,
        'subject' : {
            abbreviation : 'BIO',
            name : 'Biology'
        },
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
        'subject' : {
            abbreviation : 'MATH',
            name : 'Mathematics'
        },
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
        'subject' : {
            abbreviation : 'CS',
            name : 'Computer Science'
        },
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
                },
                {
                    'id' : 13,
                    'number' : 'C',
                    'instructor' : 'Pablo L. Enoch',
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
            abbreviation : 'CS',
            name : 'Computer Science'
        },
        'number' : '152',
        'name' : 'Comptuer Programming 2',
        'sections' : {
            'Lecture' : [
                {
                    'id' : 14,
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

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

function keys(obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

function values(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
}

// Supports negative numbers
function mod(x, y) {
    return ((x % y) + y) % y;
};

//TODO: Support weekends
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

$(function() {
    var templates = $('#templates');
    var courseTemplate = $(templates).children('.course');
    var sectionTypeTemplate = $('.sectionType', templates);
    var sectionListTemplate = $('.sections', templates);
    var sectionTemplate = $('.section', templates);
    var occuranceTemplate = $('.occurance', templates);
    var eventTemplate = $('.event', templates);

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
    var sizeEvent = function(element, start, end) {
        var duration = end - start;
        element.css('margin-top', timeHeight(start) + 1 + 'px')
               .css('height', timeHeight(duration) - 1 + 'px');
    }

    for (var hour = 0; hour < 24; hour++) {
        // Hour markers
        var time = $('<div class="time">' +
                     (hour === 0 || hour === 12 ? 12 : hour % 12) +
                     (hour < 12 ? 'am' : 'pm') +
                     '&nbsp;</div>');
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

    $.fn.eachData = function(key, callback) {
        return this.each(function(index, element) {
            var value = $(this).data(key);
            if (value !== undefined && value !== null) {
                if (callback.call(this, value, index, element) === false) {
                    return false;
                }
            }
        });
    };

    $.fn.dataEQ = function(key, value) {
        return this.filter(function() {
            return $(this).data(key) === value;
        });
    }

    var fillStripes = function(element, colors) {
        var STRIPE_RADIUS = 16;
        var STRIPE_HEIGHT = 128;
        var STRIPE_INNER_HEIGHT = 128 - STRIPE_RADIUS;
        var MIN_X = -(STRIPE_INNER_HEIGHT / STRIPE_RADIUS) - 1;
        var rows = Math.ceil(element.height() / 112);
        var cols = Math.ceil(element.width() / 16);
        for (var y = 0; y < rows; ++y) {
            var i = y * (MIN_X - 1);
            for (var x = MIN_X; x < cols; ++x) {
                element.append($('<div/>', {
                    class: 'diagonal c' + colors[mod(i, colors.length)],
                    css: {
                        left: x * STRIPE_RADIUS - STRIPE_RADIUS / 4 + 'px',
                        top: y * STRIPE_INNER_HEIGHT - STRIPE_RADIUS / 2 + 'px'
                    }
                }));
                ++i;
            }
        }
    };

    var createEvent = function(day, start, end, sections) {
        var colors = $.map(sections, function(section) {
            //TODO: LOOK UP COURSE COLOR
            return section.courseId - 1;
        });
        var newEvent = eventTemplate.clone();
        sizeEvent(newEvent, start, end);
        $('td.day.' + day + ' .container').append(newEvent);
        if (sections.length > 1) {
            fillStripes(newEvent, colors);
        } else {
            newEvent.addClass('color' + colors[0]);
        }
        var text = $.map(sections, function(section) {
            return section.id;
        }).join(', ');
        $('.content', newEvent).text(text);
    };

    var rebuildEvents = function() {
        $('.event', calendar).remove();
        for (var dayIndex in DAYS) {
            var day = DAYS[dayIndex];
            // Maps halfHourIndex to sections with that start or end time.
            //TODO: Is it OK to only support half-hour accuracy?
            var edgesByHalfHour = [];
            for (var hour = 0; hour <= 48; ++hour) {
                edgesByHalfHour.push({started:[], ended:[]});
            }
            $('.' + day + ' .occurance:visible', calendar).eachData('section',
                function(section) {
                    // Grow times to nearest containing half-hours.
                    edgesByHalfHour[Math.floor(section.start * 2)]
                        .started.push({section:section, time:section.start});
                    edgesByHalfHour[Math.ceil(section.end * 2)]
                        .ended.push({section:section, time:section.end});
                });
            var openSections = [];
            var startTime = null;
            for (var halfHourIndex in edgesByHalfHour) {
                var time = halfHourIndex / 2.0;
                var edges = edgesByHalfHour[halfHourIndex];
                if (edges.started.length > 0 || edges.ended.length > 0) {
                    if (startTime !== null) {
                        createEvent(day, startTime, time, openSections);
                    }
                    startTime = time;
                }
                for (var edgeIndex in edges.ended) {
                    var edge = edges.ended[edgeIndex];
                    openSections.splice(openSections.indexOf(edge.section), 1);
                }
                for (var edgeIndex in edges.started) {
                    var edge = edges.started[edgeIndex];
                    openSections.push(edge.section);
                }
            }
        }
    };

    $.fn.bindHighlighting = function(settings) {
        var elements = $(settings.selector, this);
        elements.eachData(settings.key, function(value) {
            $(this).mouseenter(function() {
                elements.dataEQ(settings.key, value).addClass(settings.cls);
                rebuildEvents();
            }).mouseleave(function() {
                elements.removeClass(settings.cls);
                rebuildEvents();
            });
        });
        return this;
    };

    var addCourse = function(course) {
        // Course
        var newCourse = courseTemplate.clone();
        newCourse.data('course', course);
        var sectionTypeCount = Object.size(course.sections);
        newCourse.children('.subject').text(course.subject.name);
        newCourse.children('.name').text(course.name);
        newCourse.children('.number').text(course.number);
        var sectionTypeCount = Object.size(course.sections);
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
                section.courseId = course.id;
                var newSection = sectionTemplate.clone();
                newSection.data('section', section);
                var sectionTypeName = 'section_type_' + course.id +
                                      '_' + sectionTypeIndex;
                var sectionId = 'section_' + course.id + '_' + section.id;
                newSection.children('input')
                    .attr('name', sectionTypeName)
                    .attr('id', sectionId);
                newSection.children('label')
                    .text(section.number + ' ~ ' + section.id)
                    .attr('for', sectionId);
                newSectionList.append(newSection)
                occurances = [];
                for (var dayIndex in section.days) {
                    // Occurance
                    var day = section.days[dayIndex];
                    var newOccurance = occuranceTemplate.clone();
                    newOccurance.data('course', course);
                    newOccurance.data('section', section);
                    newOccurance.children('.subject')
                        .text(course.subject.abbreviation);
                    newOccurance.children('.course').text(course.number);
                    newOccurance.children('.section').text(section.number);
                    sizeEvent(newOccurance, section.start, section.end);
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
                    $('.name', newSectionType).text(function(index, text) {
                        return text + ' ~ ' + sections[0].id;
                    });
                }
                newCourse.append(newSectionType);
            } else if (sections.length > 1) {
                newCourse.append(newSectionList);
            } else {
                newCourse.data('section', sections[0]);
                $('.name', newCourse).text(function(index, text) {
                    return text + ' ~ ' + sections[0].id;
                });
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

    $('.course, .occurance', scheduler).eachData('course', function(course) {
        //TODO: NEXT LINE IS A HACK, WILL NEED TO SELECT AN UNUSED COLOR.
        var courseColor = 'color' + (course.id - 1)
        $(this).addClass(courseColor);
    });

    var selectSection = function(section, selected) {
        var occurances = $('.occurance', calendar).dataEQ('section', section);
        if (selected) {
            $(occurances).addClass('selected');
        } else {
            $(occurances).removeClass('selected');
        }
    };

    $('.course .checkbox', courseList).change(function() {
        var course = $(this).parent().data('course');
        if ($(this).attr('checked')) {
            var courseElement = $(this).parent();
            $('.radio', courseElement).change();
            $('.sectionType', courseElement).andSelf()
                .eachData('section', function(section) {
                    selectSection(section, true);
                });
        } else {
            $('.occurance', calendar)
                .dataEQ('course', course)
                .removeClass('selected');
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
