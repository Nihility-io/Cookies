# Cookies
Wrapper around [js-cookie](https://github.com/js-cookie/js-cookie) that provides extra functionality like listening for cookie changes and storing preact state in cookies.

## Working with Cookies
This library allows you to store string, number and boolean values inside cookies and automatically detects the type when reading a cookie.

### Example
```tsx
import Cookies from "jsr:@nihility-io/use-cookie"

interface Person {
	givenName: string
	surname: string
	age: number
}

// Saving to cookies
Cookies.set("my-cookie-1", "Hello World!")
Cookies.set("my-cookie-2", 5)
Cookies.set("my-cookie-3", true)

// Reading from cookies (with optional default value)
Cookies.get<string>("my-cookie-1") // => String("Hello World!")
Cookies.get<number>("my-cookie-2") // => Number(5)
Cookies.get<boolean>("my-cookie-3") // => Boolean(true)
Cookies.get("my-cookie-4", "Hi") // => String("Hi")
Cookies.get("my-cookie-5") // => undefined

// Setting a cookie to undefined deletes the cookie
Cookies.remove("my-simple-cookie")
Cookies.set("my-cookie", undefined)
```

## Subscribing to Cookies
You can use this library to subscribe to cookie changes. This is done by intercepting the setter for `document.cookie` in order to monitor for changes made to cookies.

### Example
```tsx
import Cookies from "jsr:@nihility-io/use-cookie"

// Subtribe to changes made to the cookie 'my-cookie'
const unsubscribe = Cookies.subscribe<string>("my-cookie", (value, oldValue) => {
	console.log(`The value of "my-cookie" has changed from "${oldValue}" to "${value}".`)
})

// Stop listening for changes to the cookie 'my-cookie'
unsubscribe()
```

## Using Cookies to Store Component State
`useCookie` works just like `useState` in preact. You can use it to persist your state inside a cookie. Changing the cookie through `useCookie`, `js-cookie` or `document.cookie` automatically update the cookie's state in all components that use it.

### Example
```tsx
import { useCookie } from "jsr:@nihility-io/use-cookie"

export const MyComponent = () => {
	const [name, setName] = useCookie("name", "John Smith")
	const [age, setAge] = useCookie("age", 20)
	return (
		<div class="w-full p-4">
			<p>Name: {name}</p>
			<p>Age:  {age}</p>
			<Button label="Age 1 Year" onSubmit={() => setAge(age + 1)} />
		</div>
	)
}
```