<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{

    protected $stopOnFirstFailure = true;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'allow_partial_order' => "required|boolean",
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'products.required' => 'At least one product must be selected to place order.',
            'products.array' => 'Products must be an array.',
            'products.*.id.required' => 'Product ID is required.',
            'products.*.id.exists' => 'Selected product does not exist.',
            'products.*.quantity.required' => 'Quantity is required for each product.',
            'products.*.quantity.integer' => 'Quantity must be a number.',
            'products.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}
