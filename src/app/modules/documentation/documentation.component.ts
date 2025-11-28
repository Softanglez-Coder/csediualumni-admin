import { Component } from '@angular/core';


@Component({
    selector: 'app-documentation',
    standalone: true,
    imports: [],
    template: `
    <div class="page-container">
      <h1 class="title">Documentation & Tutorials</h1>

      <div class="content-grid">
        <div class="card doc-card">
          <h2>Getting Started</h2>
          <p>Welcome to the CSE DIU Alumni Admin Portal. This guide will help you get started with the basic features.</p>
          <ul>
            <li><strong>Dashboard:</strong> Overview of key metrics.</li>
            <li><strong>Users:</strong> Manage alumni members and requests.</li>
            <li><strong>Events:</strong> Create and manage alumni events.</li>
          </ul>
          <button class="btn btn-outline btn-sm">Read Guide</button>
        </div>

        <div class="card doc-card">
          <h2>Managing Members</h2>
          <p>Learn how to approve membership requests, update user roles, and manage member status.</p>
          <button class="btn btn-outline btn-sm">Read Guide</button>
        </div>

        <div class="card doc-card">
          <h2>Event Management</h2>
          <p>Step-by-step tutorial on creating events, managing attendees, and handling event status.</p>
          <button class="btn btn-outline btn-sm">Read Guide</button>
        </div>

        <div class="card doc-card">
          <h2>Financial Reports</h2>
          <p>Understanding payment tracking, expense management, and generating financial reports.</p>
          <button class="btn btn-outline btn-sm">Read Guide</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .doc-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
      }
      p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
        flex: 1;
      }
      ul {
        padding-left: 1.5rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }
    }
    .btn-sm {
      padding: 0.5rem;
      font-size: 0.875rem;
      align-self: flex-start;
    }
  `]
})
export class DocumentationComponent { }
