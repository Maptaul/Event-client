# Event Manager Client

Welcome to the Event Manager Client repository!

## Live Link

Front-end Live Site Link: [Your deployed URL here]
Back-end Live Site Link: [Your deployed backend URL here]

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Contact](#contact)

## Introduction

The Event Manager platform simplifies event management by allowing users to create, join, and manage events. It provides a streamlined interface for event organization and participation.

## Features

### Core Features:
- **User Authentication**: Custom authentication system without third-party packages
- **Event Management**: Create, update, and delete events
- **Event Discovery**: Browse and search events with filtering options
- **Event Participation**: Join events and track attendee counts
- **Responsive Design**: Mobile-friendly interface

## Features

1. Role-based access control: Admin, Tutor, and Student.
2. Dynamic home page showcasing sessions, tutors, and more.
3. Admin can manage users, approve/reject sessions, and control materials.
4. Tutors can create study sessions, upload materials, and manage content.
5. Students can book sessions, create notes, and access resources.
6. Toast notifications for all CRUD operations and authentication.
7. Pagination for study sessions and materials sections.
8. Secure Firebase and MongoDB configurations using environment variables.

## 🔑 Authentication & Authorization

Registration: Students, Tutors, and Admins can sign up with role selection.
Social Login: Google and GitHub logins with default role assignment as "Student."
Access Control: Middleware ensures role-based route access.

## 🏠 Home-Page
Navbar: Dynamic user options based on authentication.
Banner Section: Professional educational design.
Study Sessions: Cards with titles, descriptions, and booking options.
Tutors: List of available tutors.

## 📋 Dashboard Features
Student Dashboard
View booked sessions and leave reviews.
Create and manage personal notes.
Access study materials for booked sessions.

Tutor Dashboard
Create study sessions with approval requests.
Upload materials for approved sessions.
Manage uploaded materials.

Admin Dashboard
Manage all users with search and filtering.
Approve or reject study sessions with feedback.
View, update, or delete materials.

💡 Special Implementations
TanStack Query: Efficient GET requests.
Pagination: Enhanced user experience on critical pages.
Custom Alerts: SweetAlert2 for CRUD and authentication notifications.
Secure Credentials: Firebase and MongoDB keys hidden via environment variables.

## Installation

To install the LearnBridge Client, follow these steps:

1. Clone the repository:
        ```bash
        git clone https://github.com/maptaul/LearnBridge-client.git
        ```
2. Navigate to the project directory:
        ```bash
        cd LearnBridge-client
        ```
3. Install the dependencies:
        ```bash
        npm install
        ```

## Contact

If you have any questions or feedback, please feel free to contact us at [maptaul912@gmail.com](mailto:maptaul912@gmail.com).

Thank you for using LearnBridge Client!
