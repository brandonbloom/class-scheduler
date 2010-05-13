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

$.fn.checkboxify = function() {
    //TODO: This seems to have some problems with keyboard access.
    return this.each(function() {
        $(this).data('checked', $(this).is(':checked'));
        $(this).click(function(){
            var radio = $(this);
            if (radio.data('checked')) {
                radio.removeAttr('checked').data('checked', false).change();
            } else {
                $('input[name="' + radio.attr('name') + '"]')
                    .removeAttr('checked').data('checked', false);
                radio.attr('checked', true).data('checked', true);
            }
        });
    });
};

//TODO: Support weekends
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

$(function() {
    // These map IDs to their corresponding objects.
    var courses = {};
    var selectedCourses = {};
    var selectedSections = {};

    var hoveredCourseId = null;

    var templates = $('#templates');
    var courseTemplate = $(templates).children('.course');
    var sectionTypeTemplate = $('.sectionType', templates);
    var sectionListTemplate = $('.sections', templates);
    var sectionTemplate = $('.section', templates);
    var eventTemplate = $('.event', templates);

    var measurer = $('#measurer');
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

    var createEvent = function(day, start, end, sections) {
        var newEvent = eventTemplate.clone();
        var duration = end - start;
        var top = timeHeight(start);
        var height = timeHeight(duration);
        $('td.day.' + day + ' .container').append(newEvent);
        var positionElement = function(element, top, height) {
            element.css('margin-top', top + 'px')
                   .css('height', height + 'px');
        }
        positionElement(newEvent, top, height + 1);
        var content = $('.content', newEvent);
        positionElement(content, 1, height - 1);
        var addData = function(element, section) {
            element.data('course', courses[section.courseId])
                   .data('section', section);
            if (hoveredCourseId === section.courseId &&
                selectedSections.hasOwnProperty(section.id)) {
                element.addClass('a');
            }
        }
        if (sections.length > 1) {
            //TODO: Handle course self-conflicts.
            // Maybe show white stripes?
            var STRIPE_RADIUS = 16;
            var STRIPE_HEIGHT = 128;
            var STRIPE_INNER_HEIGHT = 128 - STRIPE_RADIUS;
            var MIN_X = -(STRIPE_INNER_HEIGHT / STRIPE_RADIUS) - 1;
            var rows = Math.ceil(height / 112);
            var cols = Math.ceil(newEvent.width() / 16);
            var stripeContainers = [];
            for (var sectionIndex in sections) {
                var section = sections[sectionIndex];
                var color = courses[section.courseId].color;
                var stripeContainer = $('<div/>', {
                    'class' : 'stripes ' + color
                });
                addData(stripeContainer, section);
                var adjustTop = (section.start === start ? 1 : 0);
                var adjustHeight = (section.end === end ? 0 : 1);
                positionElement(stripeContainer, adjustTop,
                                height + adjustHeight - adjustTop);
                stripeContainers.push(stripeContainer);
                $(newEvent).prepend(stripeContainer);
            }
            for (var y = 0; y < rows; ++y) {
                var i = y * (MIN_X - 1);
                for (var x = MIN_X; x < cols; ++x) {
                    var sectionIndex = mod(i, sections.length)
                    var section = sections[sectionIndex];
                    var adjust = (section.start === start ? 1 : 0);
                    stripeContainers[sectionIndex].append($('<div/>', {
                        css: {
                            left: (x * STRIPE_RADIUS -
                                   STRIPE_RADIUS / 4) + adjust + 'px',
                            top: (y * STRIPE_INNER_HEIGHT -
                                  STRIPE_RADIUS / 2) - height + 'px'
                        }
                    }));
                    ++i;
                }
            }
            fillConflictContent(content, sections);
        } else {
            var section = sections[0];
            var color = courses[section.courseId].color;
            content.addClass(color);
            addData(content, section);
            fillSectionContent(content, section);
        }
    };

    var shrinkHeightToFit = function(element, iterations) {
        measurer.width(element.width());
        var height = element.height();
        for (var i in iterations) {
            var iteration = iterations[i];
            $('<div class="eventContent"/>')
                .append(iteration())
                .appendTo(measurer);
            if (measurer.height() <= height) {
                break;
            }
            measurer.contents().remove();
        }
        element.append(measurer.contents().detach());
    };

    //TODO: THESE FILL FUNCTIONS ARE GIANT INJECTION HOLES!!!

    var fillConflictContent = function(element, sections) {
        var courseSections = {};
        for (var sectionIndex in sections) {
            var section = sections[sectionIndex];
            var courseId = section.courseId;
            if (!courseSections.hasOwnProperty(courseId)) {
                courseSections[courseId] = [];
            }
            courseSections[courseId].push(section);
        }
        console.log(courseSections);
        shrinkHeightToFit(element, [
            //TODO: Group by subject where possible?
            function() {
                var s = '';
                for (var courseId in courseSections) {
                    var course = courses[courseId];
                    var sections = courseSections[courseId];
                    s += (course.subject.abbreviation + ' ' +
                          course.number + ': ');
                    s += $.map(sections, function(section) {
                        return section.number;
                    }).join(', ');
                    s += '<br/>';
                };
                return '<b>' + s + '</b>';
            },
            function() {
                return '<b>' + sections.length + ' conflicting</b>';
            }
        ]);
    };

    var fillSectionContent = function(element, section) {
        var course = courses[section.courseId];
        shrinkHeightToFit(element, [
            function() {
                return ('<b>' +
                        course.name + '<br/>' +
                        '</b>' +
                        section.type + ' ' +
                        section.number + '<br/>' +
                        '<i>' + section.instructor.name + '</i>');
            },
            function() {
                return ('<b>' +
                        course.subject.name + ' ' +
                        course.number  + '<br/>' +
                        '</b>' +
                        section.type + ' ' +
                        section.number + '<br/>' +
                        '<i>' + section.instructor.name + '</i>');
            },
            function() {
                return ('<b>' +
                        course.subject.abbreviation + ' ' +
                        course.number  + '<br>' +
                        '</b>' +
                        section.type + ' ' +
                        section.number + '<br/>' +
                        '<i>' + section.instructor.name + '</i>');
            },
            function() {
                return ('<b>' +
                        course.subject.abbreviation + ' ' +
                        course.number  + '-' +
                        '</b>' +
                        section.number + '<br/>' +
                        '<i>' + section.instructor.name + '</i>');
            },
            function() {
                return ('<b>' +
                        course.subject.abbreviation + ' ' +
                        course.number  + '<br>' +
                        '</b>' +
                        section.type + ' ' +
                        section.number);
            },
            function() {
                return ('<b>' +
                        course.subject.abbreviation + ' ' +
                        course.number  + '-' +
                        '</b>' +
                        section.number);
            }
        ]);
    };

    var showEvents = function(sections) {
        $('.event', calendar).remove();
        for (var dayIndex in DAYS) {
            var day = DAYS[dayIndex];
            // Maps halfHourIndex to sections with that start or end time.
            //TODO: Is it OK to only support half-hour accuracy?
            var edgesByHalfHour = [];
            for (var hour = 0; hour <= 48; ++hour) {
                edgesByHalfHour.push({started:[], ended:[]});
            }
            for (var sectionId in sections) {
                var section = sections[sectionId];
                if ($.inArray(day, section.days) !== -1) {
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
                    var sectionIndex = $.inArray(edge.section, openSections);
                    openSections.splice(sectionIndex, 1);
                    if (openSections.length === 0) {
                        startTime = null;
                    }
                }
                for (var edgeIndex in edges.started) {
                    var edge = edges.started[edgeIndex];
                    openSections.push(edge.section);
                    if (startTime === null) {
                        startTime = time;
                    }
                }
            }
        }
    };

    scheduler.bind('selectionChanged', function() {
        showEvents(selectedSections);
    });

    $.fn.bindSectionHighlight = function() {
        $('*', this).eachData('section', function(section) {
            var color = courses[section.courseId].color;
            $(this).mouseenter(function() {
                $(this).addClass('solid ' + color + ' b');
                $('*', calendar).dataEQ('section', section).addClass('b');
            }).mouseleave(function() {
                $(this).removeClass('b')
                .filter(':not(.course)').removeClass('solid ' + color);
                $('*', calendar).dataEQ('section', section).removeClass('b');
            });
        });
        return this;
    };

    var addCourse = function(course) {
        // TODO: Next line should pull available colors from a list.
        course.color = 'color' + (course.id - 1);
        courses[course.id] = course;
        // Course
        var newCourse = courseTemplate.clone();
        newCourse.data('course', course);
        newCourse.addClass(course.color);
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
                    .text(section.number)
                    .attr('for', radioId);
                newSectionList.append(newSection)
            }
            if (sectionTypeCount > 1) {
                // Section Type
                var newSectionType = sectionTypeTemplate.clone();
                if (sections.length > 1) {
                    newSectionType.children('.name').text(sectionType);
                    newSectionType.append(newSectionList);
                } else {
                    newSectionType.children('.name')
                        .text(sectionType + ' (' + sections[0].number + ')');
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
            var course = $(this).parents('.course').data('course');
            selectCourse(course, false);
            delete courses[course.id];
            $(this).closest('.course').slideUp(300, function() {
                $(this).remove();
            });
        });
        newCourse.bindSectionHighlight();
        courseList.append(newCourse);
    };

    for (var i in testData) {
        addCourse(testData[i]);
    }

    var selectSection = function(section, selected) {
        var course = courses[section.courseId];
        if (selected) {
            selectCourse(course, true);
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
                    if (sections.length === 1) {
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

    $('.course', courseList).mouseenter(function() {
        $(this).addClass('a');
        var course = $(this).data('course');
        hoveredCourseId = course.id;
        var allSections = values(selectedSections);
        for (var sectionType in course.sections) {
            var sections = course.sections[sectionType];
            for (var sectionIndex in sections) {
                var section = sections[sectionIndex];
                if (allSections.indexOf(section) === -1) {
                    allSections.push(section);
                }
            }
        }
        showEvents(allSections);
    }).mouseleave(function() {
        hoveredCourseId = null;
        $(this).removeClass('a');
        scheduler.trigger('selectionChanged');
    });

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

    $('.section .radio', courseList).checkboxify()
    .change(function() {
        var section = $(this).parent().data('section');
        var selected = $(this).attr('checked');
        selectSection(section, selected);
    });

    var resizeContent = function() {
        //TODO: This is a bit of a hack with magic numbers.
        $('#courseList').height($(window).height() - 68);
        $('#calendar .scroller').height($(window).height() - 68);
    };

    resizeContent();
    $(window).resize(resizeContent);

    $('.scroller', calendar).scrollTop(timeHeight(8.75));
});
