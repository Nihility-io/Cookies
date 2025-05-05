# Cookies
Wrapper around [js-cookie](https://github.com/js-cookie/js-cookie) that provides extra functionality like serialization, listening for cookie changes and storing preact state in cookies.

## Working with Cookies
This library allows you to store any JSON-serializable value inside cookie.

### Example
```tsx
import Cookies from "jsr:@nihility-io/use-cookie"

interface Person {
	givenName: string
	surname: string
	age: number
}

// Saving to cookies
Cookies.set("my-simple-cookie", "Hello World!")
Cookies.set("my-cookie", { givenName: "John", surname: "Smith", age: 20 })

// Reading from cookies (with optional default value)
Cookies.get<string>("my-simple-cookie", "some default") // => string
Cookies.get<Person>("my-cookie", Cookies.ObjectValue) // => Person | undefined
Cookies.get<Person>("my-cookie", { givenName: "John", surname: "Smith", age: 20 }) // => Person

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
	const [myCookie, setMyCookie] = useCookie("my-cookie", { givenName: "John", surname: "Smith", age: 20 })
	return (
		<div class="w-full p-4">
			<p>Name: {myCookie.givenName} {myCookie.surname}</p>
			<p>Age:  {myCookie.age}</p>
			<Button label="Age 1 Year" onSubmit={() => setMyCookie({ ...myCookie, age: myCookie + 1})} />
		</div>
	)
}
```