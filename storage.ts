import { Component, InsertComponent, UpdateComponent, User, type InsertUser } from "@shared/schema";
import { sampleComponents } from "../client/src/data/sampleComponents";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Component CRUD operations
  getComponents(): Promise<Component[]>;
  getComponent(id: number): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: UpdateComponent): Promise<Component | undefined>;
  softDeleteComponent(id: number): Promise<Component | undefined>;
  toggleFavorite(id: number): Promise<Component | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private components: Map<number, Component>;
  private currentUserId: number;
  private currentComponentId: number;

  constructor() {
    this.users = new Map();
    this.components = new Map();
    this.currentUserId = 1;
    this.currentComponentId = 1;
    
    // Initialize with sample components
    this.initializeSampleComponents();
  }

  private initializeSampleComponents() {
    // Add sample components from the sampleComponents data
    const componentsData = sampleComponents;
    componentsData.forEach((comp) => {
      const component: Component = {
        id: this.currentComponentId++,
        title: comp.title,
        category: comp.category,
        htmlCode: comp.htmlCode,
        cssCode: comp.cssCode || "",
        jsCode: comp.jsCode || "",
        tags: comp.tags || [],
        isDeleted: false,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.components.set(component.id, component);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getComponents(): Promise<Component[]> {
    return Array.from(this.components.values()).filter(comp => !comp.isDeleted);
  }

  async getComponent(id: number): Promise<Component | undefined> {
    const component = this.components.get(id);
    return component && !component.isDeleted ? component : undefined;
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const id = this.currentComponentId++;
    const newComponent: Component = {
      ...component,
      id,
      cssCode: component.cssCode || "",
      jsCode: component.jsCode || "",
      tags: component.tags || [],
      isDeleted: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.components.set(id, newComponent);
    return newComponent;
  }

  async updateComponent(id: number, updates: UpdateComponent): Promise<Component | undefined> {
    const component = this.components.get(id);
    if (!component || component.isDeleted) {
      return undefined;
    }

    const updatedComponent: Component = {
      ...component,
      ...updates,
      updatedAt: new Date(),
    };
    this.components.set(id, updatedComponent);
    return updatedComponent;
  }

  async softDeleteComponent(id: number): Promise<Component | undefined> {
    const component = this.components.get(id);
    if (!component) {
      return undefined;
    }

    const deletedComponent: Component = {
      ...component,
      isDeleted: true,
      updatedAt: new Date(),
    };
    this.components.set(id, deletedComponent);
    return deletedComponent;
  }

  async toggleFavorite(id: number): Promise<Component | undefined> {
    const component = this.components.get(id);
    if (!component || component.isDeleted) {
      return undefined;
    }

    const updatedComponent: Component = {
      ...component,
      isFavorite: !component.isFavorite,
      updatedAt: new Date(),
    };
    this.components.set(id, updatedComponent);
    return updatedComponent;
  }
}

export const storage = new MemStorage();
