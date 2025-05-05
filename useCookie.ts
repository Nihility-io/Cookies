import { Dispatch, useEffect, useState } from "preact/hooks"
import { BooleanValue, CookieOptions, Cookies, CookieValue, NumberValue, ObjectValue, StringValue } from "./cookies.ts"

const cookieValueFromDefaultValue = (value: unknown): CookieValue => {
	switch (typeof value) {
		case "string":
			return StringValue
		case "number":
			return NumberValue
		case "boolean":
			return BooleanValue
		case "object":
			return ObjectValue
		default:
			return StringValue
	}
}

/**
 * Creates a preact state that stores the value inside a cookie. useCookie updates in response
 * to external cookie updates
 * @param name Cookie name
 * @param defaultValue Default value if the cookie does not exist
 * @param options Cookie options (Cookie expires after 10 years by default)
 * @returns Current cookie value
 */
export function useCookie(name: string, defaultValue: string, options?: CookieOptions): [string, Dispatch<string>]
export function useCookie(name: string, defaultValue: number, options?: CookieOptions): [number, Dispatch<number>]
export function useCookie(name: string, defaultValue: boolean, options?: CookieOptions): [boolean, Dispatch<boolean>]
export function useCookie<T>(name: string, defaultValue: T, options: CookieOptions): [T, Dispatch<T>]
export function useCookie<T>(
	name: string,
	defaultValue: T,
	options: CookieOptions = { expires: 3650 },
): [T, Dispatch<T>] {
	// Create a preact state with the default value
	const [result, setResult] = useState<T>(defaultValue)

	useEffect(() => {
		// Read the current cookie value
		setResult(Cookies.get(name, defaultValue))

		// Subscribe to changes to the cookie and update the state if changes are detected
		const unsubscribe = Cookies.subscribe<T>(name, (newValue) => {
			setResult(newValue)
		}, cookieValueFromDefaultValue(defaultValue) as any)

		// Unsubscribe on cleanup
		return () => {
			unsubscribe()
		}
	}, [typeof defaultValue === "object" ? JSON.stringify(defaultValue) : defaultValue])

	// Cookie setter
	const setter = (newValue: T) => {
		Cookies.set(name, newValue, options)
	}

	return [result, setter]
}
