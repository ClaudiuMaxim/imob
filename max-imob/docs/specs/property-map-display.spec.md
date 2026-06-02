# Property Map Display Specification

## 1. General Information
- **Feature name:** Property Map Display
- **Feature type:** Frontend
- **Version:** 1.0
- **Author:** Claudiu Ștefan

---

## 2. Problem Statement
Currently, property details page shows only the address text. Users cannot visualize the property location on a map, making it harder to understand the geographic context of the property.

---

## 3. Objectives
- **Main goal:** Display an interactive map showing the property location on the property details page
- **Secondary goal:** Allow users to click on the map to get directions

---

## 4. Functional Requirements
- Map should display the location of the property address
- Map should appear below the address text in the property details panel
- Map should be responsive and work on mobile and desktop
- Map should auto-center on the property location
- Map should show a marker/pin at the property location

---

## 5. Non-Functional Requirements
- **Performance:** Map should load quickly without blocking page render
- **Security:** No API keys exposed in frontend code (use environment variables)
- **Usability:** Map should be intuitive and not require user interaction beyond viewing
- **Maintainability:** Use a well-supported mapping library (Leaflet with OpenStreetMap)

---

## 6. User Stories
- As a property visitor, I want to see where the property is located on a map so I can understand its geographic context
- As a user browsing from mobile, I want the map to be responsive and easy to view

---

## 7. System Design

### Frontend Design
- **Location:** PropertyDetailsInfo component in `app/properties/[id]/components/property-details-info.tsx`
- **Implementation:** iframe embed directly in component (no new component needed)
- **Service:** Google Maps (iframe embed)
- **Styling:** Bootstrap-compatible, responsive design

---

## 8. Implementation Details

### Map Integration
- Use Google Maps iframe embed directly in PropertyDetailsInfo
- Generate iframe URL from address string
- URL format: `https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=ADDRESS`
- Environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`

### Setup
- Add Google Maps Embed API key to `.env.local`
- Environment variable name: `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`
- Generate free API key at: https://console.cloud.google.com/

### Integration
- Add iframe directly in PropertyDetailsInfo component
- Place below the address text section
- Use responsive container with Bootstrap classes
- Set iframe dimensions: width="100%", height="400"

---

## 9. Data Flow
1. PropertyDetails loads property data (include with address
3. Component generates Google Maps embed URL from address
4. iframe renders with Google Maps showing location
5. User can interact with map directlye/longitude
5. Leaflet renders map with marker at those coordinates

---

## 10. Validation Rules
- Address must be non-empty string
- Geocoding response must include valid coordinates
- Map should gracefully handle geocoding failures

---

## 11. Security Considerations
- API key stored in environment variable (NEXT_PUBLIC_* can be public for Embed API)
- Restrict API key in Google Cloud Console to Embed API only
- Address data is public (already visible in property details)

---

## 12. Edge Cases
- Address format variations (Str.Paraului nr.7A, etc.)
- Partial/incomplete addresses (city only)
- Address not found by geocoder → show error or fallback
- User on slow network → show loading state while geocoding

---

## 13. Acceptance Criteria
- [ ] PropertyMap component created and tested
- [ ] Map displays on property details page
- [ ] Address is correctly geocoded and displayed
- [ ] Map is responsive (mobile and desktop)
- [ ] Error handling works (address not found)
- [ ] No console errors
- [ ] ESLint passes

---

## 14. Future Improvements
- Add directions button to map
- Add multiple location markers (nearby schools, hospitals)
- Switch between satellite/terrain view options
- Enhance with property walking score data
