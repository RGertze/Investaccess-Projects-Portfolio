<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Add event handlers for the assign
 *
 * @package    local_sca_its_synchronizer
 * @category   event
 * @copyright  
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

$observers = array(

    // users
    array(
        'eventname' => '\core\event\user_created',
        'callback' => '\local_sca_its_synchronizer\user_observers::user_created',
    ),
    array(
        'eventname' => '\core\event\user_deleted',
        'callback' => '\local_sca_its_synchronizer\user_observers::user_deleted',
    ),
    array(
        'eventname' => '\core\event\user_updated',
        'callback' => '\local_sca_its_synchronizer\user_observers::user_updated',
    ),


    // categories
    array(
        'eventname' => 'core\event\course_category_created',
        'callback' => '\local_sca_its_synchronizer\category_observers::category_created',
    ),
    array(
        'eventname' => 'core\event\course_category_deleted',
        'callback' => '\local_sca_its_synchronizer\category_observers::category_deleted',
    ),
    array(
        'eventname' => 'core\event\course_category_updated',
        'callback' => '\local_sca_its_synchronizer\category_observers::category_updated',
    ),

    // courses
    array(
        'eventname' => 'core\event\course_created',
        'callback' => '\local_sca_its_synchronizer\course_observers::course_created',
    ),
    array(
        'eventname' => 'core\event\course_deleted',
        'callback' => '\local_sca_its_synchronizer\course_observers::course_deleted',
    ),
    array(
        'eventname' => 'core\event\course_updated',
        'callback' => '\local_sca_its_synchronizer\course_observers::course_updated',
    ),
);
