var testData = [
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
    // These map IDs to their corresponding objects.
    var courses = {};
    var selectedCourses = {};
    var selectedSections = {};

    var templates = $('#templates');
    var courseTemplate = $(templates).children('.course');
    var sectionTypeTemplate = $('.sectionType', templates);
    var sectionListTemplate = $('.sections', templates);
    var sectionTemplate = $('.section', templates);
    var eventTemplate = $('.event', templates);

    var scheduler = $('#scheduler');
    var courseList = $('#courseList', scheduler);
    var calendar = $('#calendar');

    var timeHeight = function(time) {
        return time * 56;
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
        //TODO: Handle (colors.length == 0) Maybe show white stripes?
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
            for (var sectionId in selectedSections) {
                var section = selectedSections[sectionId];
                if (section.days.indexOf(day) != -1) {
                    // Grow times to nearest containing half-hours.
                    edgesByHalfHour[Math.floor(section.start * 2)]
                        .started.push({section:section, time:section.start});
                    edgesByHalfHour[Math.ceil(section.end * 2)]
                        .ended.push({section:section, time:section.end});
                }
            }
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

    scheduler.bind('selectionChanged', function() {
        console.log('selectionChanged');
        rebuildEvents();
    });

    $.fn.bindHighlighting = function(settings) {
        var elements = $(settings.selector, this);
        elements.eachData(settings.key, function(value) {
            $(this).mouseenter(function() {
                elements.dataEQ(settings.key, value).addClass(settings.cls);
                scheduler.trigger('selectionChanged');
            }).mouseleave(function() {
                elements.removeClass(settings.cls);
                scheduler.trigger('selectionChanged');
            });
        });
        return this;
    };

    var addCourse = function(course) {
        courses[course.id] = course;
        // Course
        var newCourse = courseTemplate.clone();
        newCourse.data('course', course);
        var sectionTypeCount = Object.size(course.sections);
        var checkboxId = 'course_' + course.id;
        newCourse.children('input').attr('id', checkboxId);
        newCourse.children('label').attr('for', checkboxId);
        newCourse.find('.subject').text(course.subject.name);
        newCourse.find('.name').text(course.name);
        newCourse.find('.number').text(course.number);
        var sectionTypeCount = Object.size(course.sections);
        var sectionTypeIndex = 0;
        for (var sectionType in course.sections) {
            // Section List
            var sections = course.sections[sectionType];
            var newSectionList = sectionListTemplate.clone();
            for (var sectionIndex in sections) {
                // Section
                var section = sections[sectionIndex];
                section.courseId = course.id;
                section.type = sectionType;
                var newSection = sectionTemplate.clone();
                newSection.data('section', section);
                var sectionTypeName = 'section_type_' + course.id +
                                      '_' + sectionTypeIndex;
                var radioId = 'section_' + course.id + '_' + section.id;
                newSection.children('input')
                    .attr('name', sectionTypeName)
                    .attr('id', radioId);
                newSection.children('label')
                    .text(section.number + ' ~ ' + section.id)
                    .attr('for', radioId);
                newSectionList.append(newSection)
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
            var course = $(this).parents('.course').data('course');
            delete courses[course.id];
            $(this).closest('.course').slideUp(300, function() {
                $(this).remove();
            });
            scheduler.trigger('selectionChanged');
        });
        courseList.append(newCourse);
    };

    for (var i in testData) {
        addCourse(testData[i]);
    }

    scheduler.bindHighlighting({
        selector: 'div.course',
        key: 'course',
        cls: 'active'
    }).bindHighlighting({
        selector: 'div.course, div.section, .sectionType',
        key: 'section',
        cls: 'targeted'
    });

    $('.course', scheduler).eachData('course', function(course) {
        //TODO: NEXT LINE IS A HACK, WILL NEED TO SELECT AN UNUSED COLOR.
        var courseColor = 'color' + (course.id - 1)
        $(this).addClass(courseColor);
    });

    var selectSection = function(section, selected) {
        var course = courses[section.courseId];
        selectCourse(course, selected);
        if (selected) {
            if (!selectedSections.hasOwnProperty(section.id)) {
                var siblings = course.sections[section.type];
                for (var siblingIndex in siblings) {
                    var sibling = siblings[siblingIndex];
                    delete selectedSections[sibling.id];
                }
                selectedSections[section.id] = section;
                scheduler.trigger('selectionChanged');
            }
        } else if (delete selectedSections[section.id]) {
            scheduler.trigger('selectionChanged');
        }
    };

    var selectCourse = function(course, selected) {
        if (selected) {
            if (!selectedCourses.hasOwnProperty(course.id)) {
                //TODO: This checkbox should listen for this as an event.
                $('.course', courseList)
                    .dataEQ('course', course)
                    .find('.checkbox')
                    .attr('checked', true);
                selectedCourses[course.id] = course;
                // Automatically add singular sections of a section type.
                for (var sectionType in course.sections) {
                    var sections = course.sections[sectionType];
                    if (sections.length == 1) {
                        selectSection(sections[0], true);
                    }
                }
                scheduler.trigger('selectionChanged');
            }
        } else if (delete selectedCourses[course.id]) {
            // Clear section selections.
            for (var sectionType in course.sections) {
                var sections = course.sections[sectionType];
                for (var sectionIndex in sections) {
                    var section = sections[sectionIndex];
                    delete selectedSections[section.id];
                }
            }
            scheduler.trigger('selectionChanged');
        }
    };

    $('.course .checkbox', courseList).change(function() {
        var parent = $(this).parent();
        var course = parent.data('course');
        var selected = $(this).attr('checked');
        selectCourse(course, selected);
        if (selected) {
            // Re-select already radio-filled choices
            $('.radio', parent).change();
        }
    });

    $('.course .radio', courseList).change(function() {
        var section = $(this).parent().data('section');
        var selected = $(this).attr('checked');
        console.log(section.id);
        if (selected) {
            selectSection(section, true);
        }
    });

    $('.scroller', calendar).scrollTop(timeHeight(8.75));
});
