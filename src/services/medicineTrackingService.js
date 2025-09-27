// src/services/medicineTrackingService.js
import { v4 as uuidv4 } from 'uuid';

// A* pathfinding algorithm implementation
class AStarPathfinder {
  constructor(grid, start, goal, obstacles = []) {
    this.grid = grid;
    this.start = start;
    this.goal = goal;
    this.obstacles = obstacles;
    this.openSet = [];
    this.closedSet = [];
    this.cameFrom = new Map();
    this.gScore = new Map();
    this.fScore = new Map();
  }

  // Calculate heuristic distance (Manhattan distance)
  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Get neighbors of a point
  getNeighbors(point) {
    const neighbors = [];
    const directions = [
      { x: 0, y: 1 },   // up
      { x: 1, y: 0 },   // right
      { x: 0, y: -1 },  // down
      { x: -1, y: 0 },  // left
      { x: 1, y: 1 },   // up-right
      { x: 1, y: -1 },  // down-right
      { x: -1, y: -1 }, // down-left
      { x: -1, y: 1 }   // up-left
    ];

    for (const dir of directions) {
      const neighbor = { x: point.x + dir.x, y: point.y + dir.y };
      
      // Check if neighbor is within grid bounds
      if (neighbor.x >= 0 && neighbor.x < this.grid.width && 
          neighbor.y >= 0 && neighbor.y < this.grid.height) {
        
        // Check if neighbor is not an obstacle
        const isObstacle = this.obstacles.some(obs => 
          obs.x === neighbor.x && obs.y === neighbor.y
        );
        
        if (!isObstacle) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  // Convert point to string for Map keys
  pointToString(point) {
    return `${point.x},${point.y}`;
  }

  // Convert string back to point
  stringToPoint(str) {
    const [x, y] = str.split(',').map(Number);
    return { x, y };
  }

  // Find the path using A* algorithm
  findPath() {
    const startStr = this.pointToString(this.start);
    const goalStr = this.pointToString(this.goal);

    // Initialize
    this.openSet = [this.start];
    this.gScore.set(startStr, 0);
    this.fScore.set(startStr, this.heuristic(this.start, this.goal));

    while (this.openSet.length > 0) {
      // Find node with lowest fScore
      let current = this.openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < this.openSet.length; i++) {
        const currentStr = this.pointToString(current);
        const nodeStr = this.pointToString(this.openSet[i]);
        
        if (this.fScore.get(nodeStr) < this.fScore.get(currentStr)) {
          current = this.openSet[i];
          currentIndex = i;
        }
      }

      // Remove current from openSet
      this.openSet.splice(currentIndex, 1);
      const currentStr = this.pointToString(current);

      // Add to closedSet
      this.closedSet.push(currentStr);

      // Check if we reached the goal
      if (currentStr === goalStr) {
        return this.reconstructPath(current);
      }

      // Check all neighbors
      const neighbors = this.getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const neighborStr = this.pointToString(neighbor);

        // Skip if already in closedSet
        if (this.closedSet.includes(neighborStr)) {
          continue;
        }

        // Calculate tentative gScore
        const tentativeGScore = this.gScore.get(currentStr) + 1;

        // If neighbor not in openSet, add it
        if (!this.openSet.some(node => this.pointToString(node) === neighborStr)) {
          this.openSet.push(neighbor);
        } else if (tentativeGScore >= this.gScore.get(neighborStr)) {
          continue; // This path is not better
        }

        // This path is the best so far
        this.cameFrom.set(neighborStr, current);
        this.gScore.set(neighborStr, tentativeGScore);
        this.fScore.set(neighborStr, tentativeGScore + this.heuristic(neighbor, this.goal));
      }
    }

    // No path found
    return null;
  }

  // Reconstruct the path from goal to start
  reconstructPath(current) {
    const path = [current];
    const currentStr = this.pointToString(current);

    while (this.cameFrom.has(currentStr)) {
      current = this.cameFrom.get(currentStr);
      path.unshift(current);
    }

    return path;
  }
}

// Medicine tracking service
export const medicineTrackingService = {
  // Create a delivery route using A* algorithm
  createDeliveryRoute: (startLocation, endLocation, obstacles = []) => {
    try {
      // Create a simple grid (20x20 for demo)
      const grid = { width: 20, height: 20 };
      
      // Convert locations to grid coordinates
      const start = { x: startLocation.x || 0, y: startLocation.y || 0 };
      const goal = { x: endLocation.x || 19, y: endLocation.y || 19 };
      
      // Create pathfinder and find path
      const pathfinder = new AStarPathfinder(grid, start, goal, obstacles);
      const path = pathfinder.findPath();
      
      if (!path) {
        console.warn('No path found, using direct route');
        return {
          path: [start, goal],
          distance: Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y),
          estimatedTime: 30 // minutes
        };
      }
      
      return {
        path,
        distance: path.length,
        estimatedTime: path.length * 2 // 2 minutes per step
      };
    } catch (error) {
      console.error('Error creating delivery route:', error);
      return null;
    }
  },

  // Start a delivery
  startDelivery: (deliveryData) => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      
      const delivery = {
        id: uuidv4(),
        ...deliveryData,
        status: 'in_transit',
        currentStep: 0,
        startedAt: new Date().toISOString(),
        progress: 0
      };
      
      deliveries.push(delivery);
      localStorage.setItem('deliveries', JSON.stringify(deliveries));
      
      return delivery;
    } catch (error) {
      console.error('Error starting delivery:', error);
      return null;
    }
  },

  // Get deliveries for a patient
  getPatientDeliveries: (patientId) => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      return deliveries.filter(delivery => delivery.patientId === patientId);
    } catch (error) {
      console.error('Error getting patient deliveries:', error);
      return [];
    }
  },

  // Simulate delivery progress
  simulateDeliveryProgress: (deliveryId) => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
      
      if (deliveryIndex === -1) return null;
      
      const delivery = deliveries[deliveryIndex];
      
      if (delivery.status !== 'in_transit') return delivery;
      
      // Move to next step
      delivery.currentStep = Math.min(
        delivery.currentStep + 1,
        delivery.route.path.length - 1
      );
      
      // Update progress
      delivery.progress = (delivery.currentStep / delivery.route.path.length) * 100;
      
      // Check if delivered
      if (delivery.currentStep >= delivery.route.path.length - 1) {
        delivery.status = 'delivered';
        delivery.deliveredAt = new Date().toISOString();
        delivery.progress = 100;
      }
      
      deliveries[deliveryIndex] = delivery;
      localStorage.setItem('deliveries', JSON.stringify(deliveries));
      
      return delivery;
    } catch (error) {
      console.error('Error simulating delivery progress:', error);
      return null;
    }
  },

  // Get delivery by ID
  getDeliveryById: (deliveryId) => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      return deliveries.find(delivery => delivery.id === deliveryId);
    } catch (error) {
      console.error('Error getting delivery by ID:', error);
      return null;
    }
  },

  // Update delivery status
  updateDeliveryStatus: (deliveryId, status) => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
      
      if (deliveryIndex === -1) return null;
      
      deliveries[deliveryIndex].status = status;
      deliveries[deliveryIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('deliveries', JSON.stringify(deliveries));
      
      return deliveries[deliveryIndex];
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return null;
    }
  },

  // Get all deliveries
  getAllDeliveries: () => {
    try {
      return JSON.parse(localStorage.getItem('deliveries') || '[]');
    } catch (error) {
      console.error('Error getting all deliveries:', error);
      return [];
    }
  },

  // Calculate delivery statistics
  getDeliveryStats: () => {
    try {
      const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      
      const stats = {
        total: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending').length,
        inTransit: deliveries.filter(d => d.status === 'in_transit').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        averageDeliveryTime: 0
      };
      
      // Calculate average delivery time
      const deliveredDeliveries = deliveries.filter(d => d.status === 'delivered' && d.deliveredAt);
      if (deliveredDeliveries.length > 0) {
        const totalTime = deliveredDeliveries.reduce((sum, delivery) => {
          const start = new Date(delivery.startedAt);
          const end = new Date(delivery.deliveredAt);
          return sum + (end - start);
        }, 0);
        
        stats.averageDeliveryTime = Math.round(totalTime / deliveredDeliveries.length / (1000 * 60)); // in minutes
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting delivery stats:', error);
      return {
        total: 0,
        pending: 0,
        inTransit: 0,
        delivered: 0,
        averageDeliveryTime: 0
      };
    }
  }
};

// Export the pathfinding algorithm for testing
export const findShortestPath = (start, goal, obstacles = []) => {
  const grid = { width: 20, height: 20 };
  const pathfinder = new AStarPathfinder(grid, start, goal, obstacles);
  return pathfinder.findPath();
};
