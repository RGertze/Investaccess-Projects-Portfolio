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
 * Version information
 *
 * @package    local_sca_its_synchronizer
 * @copyright 
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_sca_its_synchronizer;

use Exception;

require_once(__DIR__ . '/../../../config.php');

class category_observers
{
    private static $token = "9843844de5756346033badb411d773deee54e78899568c9e0b99ea060eb1ea89";

    public static function category_created($event)
    {
        global $DB;

        /**
         *  1. check if category was created by the sca webservice user.
         *  If it was, return  
         */
        error_log("SCA CATEGORY OBSERVER  ---->> category created by: {$event->userid}");
        error_log("SCA CATEGORY OBSERVER  ---->> event data: " . <<<EOD
        $event->categoryid
        $event->objectid
        $event->objecttable
        $event->other
        EOD);

        $userWhoTriggeredEvent = $DB->get_record('user', ['id' => "{$event->userid}"]);

        if ($userWhoTriggeredEvent->username == "sca_web_user")
            return;

        /**
         * 2. call sca endpoint to sync data
         */

        $createdCategory = $DB->get_record('course_categories', ['id' => "{$event->objectid}"]);
        $dataToPost = array(
            "id" => $createdCategory->id,
            "name" => "{$createdCategory->name}",
            "description" => "{$createdCategory->description}",
            "parent" => $createdCategory->parent,
            "token" => self::$token,
        );

        $jsencode = json_encode($dataToPost);
        error_log("SCA CATEGORY OBSERVER  ---->> category created json: {$jsencode}");

        $url = 'http://app:5000/api/moodle-sync/categories/created';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataToPost));

        $response = curl_exec($ch);
        $response = json_decode($response);

        $info = curl_getinfo($ch);

        curl_close($ch);

        if ($info["http_code"] == 200) {
            error_log("SCA CATEGORY OBSERVER  ---->> Moodle Category sync with ITS successful!");
            return;
        }

        error_log("SCA CATEGORY OBSERVER  ---->> status code: {$info["http_code"]}");
        throw new Exception("Failed to sync with ITS!");
    }

    public static function category_deleted($event)
    {

        global $DB;

        /**
         *  1. check if category was created by the sca webservice user.
         *  If it was, return  
         */
        error_log("SCA CATEGORY OBSERVER  ---->> category deleted by: {$event->userid}");
        error_log("SCA CATEGORY OBSERVER  ---->> event data: " . <<<EOD
        $event->categoryid
        $event->objectid
        $event->objecttable
        $event->other
        EOD);

        $userWhoTriggeredEvent = $DB->get_record('user', ['id' => "{$event->userid}"]);

        if ($userWhoTriggeredEvent->username == "sca_web_user")
            return;


        /**
         * 2. call sca endpoint to sync data
         */

        // get deleted record
        $deletedCategory = $event->get_record_snapshot('course_categories', strval($event->objectid));

        $dataToPost = array(
            "id" => $deletedCategory->id,
            "token" => self::$token,
        );
        error_log("SCA CATEGORY OBSERVER  ---->> category to delete: " . <<<EOD
        $deletedCategory->id
        $deletedCategory->name
        $deletedCategory->description
        $deletedCategory->parent
        EOD);

        $url = 'http://app:5000/api/moodle-sync/categories/deleted';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataToPost));

        $response = curl_exec($ch);
        $response = json_decode($response);

        $info = curl_getinfo($ch);

        curl_close($ch);

        if ($info["http_code"] == 200) {
            error_log("SCA CATEGORY OBSERVER  ---->> Moodle Category sync with ITS successful!");
            return;
        }

        error_log("SCA CATEGORY OBSERVER  ---->> status code: {$info["http_code"]}");
        throw new Exception("Failed to sync with ITS!");
    }

    public static function category_updated($event)
    {

        global $DB;

        /**
         *  1. check if category was created by the sca webservice user.
         *  If it was, return  
         */
        error_log("SCA CATEGORY OBSERVER  ---->> category updated by: {$event->userid}");
        error_log("SCA CATEGORY OBSERVER  ---->> event data: " . <<<EOD
        $event->categoryid
        $event->objectid
        $event->objecttable
        $event->other
        EOD);

        $userWhoTriggeredEvent = $DB->get_record('user', ['id' => "{$event->userid}"]);

        if ($userWhoTriggeredEvent->username == "sca_web_user")
            return;


        /**
         * 2. call sca endpoint to sync data
         */

        $createdCategory = $DB->get_record('course_categories', ['id' => "{$event->objectid}"]);
        $dataToPost = array(
            "id" => $createdCategory->id,
            "name" => "{$createdCategory->name}",
            "description" => "{$createdCategory->description}",
            "parent" => $createdCategory->parent,
            "token" => self::$token,
        );

        $url = 'http://app:5000/api/moodle-sync/categories/updated';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataToPost));

        $response = curl_exec($ch);
        $response = json_decode($response);

        $info = curl_getinfo($ch);

        curl_close($ch);

        if ($info["http_code"] == 200) {
            error_log("SCA CATEGORY OBSERVER  ---->> Moodle Category sync with ITS successful!");
            return;
        }

        error_log("SCA CATEGORY OBSERVER  ---->> status code: {$info["http_code"]}");
        throw new Exception("Failed to sync with ITS!");
    }
}
