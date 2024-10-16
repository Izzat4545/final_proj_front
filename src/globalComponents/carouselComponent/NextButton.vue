<template>
  <button class="embla__button embla__button--next" type="button">
    <svg class="embla__button__svg" viewBox="0 0 532 532">
      <path
        d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
      />
    </svg>
  </button>
</template>

<style scoped>
.embla__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 50%;
  background-color: white;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.embla__button__svg {
  width: 20px;
  height: 20px;
  fill: #333;
  transition: fill 0.3s ease;
}

.embla__button__svg:hover {
  fill: white;
}

.embla__button:hover {
  background-color: #ef4444;
  border-color: #ef4444;
}

.embla__button:hover .embla__button__svg {
  fill: white;
}
</style>
