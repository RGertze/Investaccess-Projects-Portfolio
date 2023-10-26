<?php

namespace App\Models;

/**
 * API response class
 *
 * @property mixed $data
 * @property string $message
 */
class ApiResponse
{
    /**
     * @var mixed
     */
    public $data;

    /**
     * @var string
     */
    public $message;

    /**
     * ApiResponse constructor.
     *
     * @param mixed $data
     * @param string $message
     */
    public function __construct(mixed $data, string $message = '')
    {
        $this->data = $data;
        $this->message = $message;
    }

    /**
     * @return string
     */
    public function toJson(): string
    {
        return json_encode($this);
    }
}


