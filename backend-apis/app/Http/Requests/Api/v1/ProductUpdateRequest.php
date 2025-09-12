<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProductUpdateRequest extends FormRequest
{

    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;

    protected function prepareForValidation()
    {
        $product = $this->route('product');
        if ($product) {
            Gate::authorize('update', $product);
        }
    }

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
            "name" => "string|max:255",
            "sku" => [
                'string',
                'max:255',
                Rule::unique('products', 'sku')->where('shop_id', Auth::user()->shop_id)->ignore($this->route('product')->id)
            ],
            "price" => "numeric|min:0",
            "stock" => "numeric|min:0"
        ];
    }

    public function messages(): array
    {
        return [
            "name.string" => "Product name must be a string.",
            "sku.unique"   => "This SKU already exists in your shop. Please use a different one.",
            "price.numeric"  => "Price must be a valid number.",
            "stock.numeric"  => "Stock must be a valid number.",
        ];
    }
}
