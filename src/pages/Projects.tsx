
import * as React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { 
  Code, 
  ExternalLink, 
  Github, 
  Folder,
  Database,
  Server,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  links?: {
    demo?: string;
    github?: string;
  };
  challenge?: string;
  solution?: string;
}

const Projects = () => {
  const projects: Project[] = [
    {
      title: "Distributed Data Processing Pipeline",
      description: "A high-throughput data processing system handling 10TB+ daily, built with Apache Kafka, Spark, and Airflow",
      icon: <Database className="h-6 w-6" />,
      tags: ["Python", "Kafka", "Spark", "Airflow", "AWS"],
      challenge: "Building a system that could process 10TB+ of data daily with sub-second latency requirements while maintaining fault tolerance.",
      solution: "Implemented a Lambda architecture combining batch and stream processing, with automatic failover and data partitioning strategies to optimize throughput.",
      codeSnippet: {
        language: "python",
        code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import window, col

# Initialize Spark with optimized configuration
spark = SparkSession.builder \\
    .appName("RealTimeDataProcessor") \\
    .config("spark.executor.memory", "8g") \\
    .config("spark.executor.cores", "4") \\
    .config("spark.dynamicAllocation.enabled", "true") \\
    .getOrCreate()

# Process streaming data with windowed aggregations
def process_stream():
    stream_df = spark \\
        .readStream \\
        .format("kafka") \\
        .option("kafka.bootstrap.servers", "kafka:9092") \\
        .option("subscribe", "events") \\
        .load()
    
    # Parse JSON payload
    parsed = stream_df.selectExpr("CAST(value AS STRING)") \\
        .select(from_json(col("value"), schema).alias("data")) \\
        .select("data.*")
    
    # Apply windowed aggregations
    result = parsed \\
        .withWatermark("timestamp", "1 minute") \\
        .groupBy(
            window(col("timestamp"), "10 minutes", "5 minutes"),
            col("user_id")
        ) \\
        .agg(count("*").alias("event_count"))
    
    # Write results to sink
    query = result \\
        .writeStream \\
        .outputMode("update") \\
        .format("console") \\
        .start()
        
    return query`
      },
      links: {
        github: "#",
      }
    },
    {
      title: "ML Model Serving Platform",
      description: "A scalable platform for deploying, serving, and monitoring machine learning models in production",
      icon: <BarChart className="h-6 w-6" />,
      tags: ["Python", "TensorFlow", "Docker", "Kubernetes", "FastAPI", "Redis"],
      challenge: "Creating a system to serve hundreds of ML models with low-latency requirements and automatic scaling based on traffic patterns.",
      solution: "Built a Kubernetes-based platform with custom autoscaling, model versioning, A/B testing capabilities, and a Redis-based feature store for fast lookups.",
      codeSnippet: {
        language: "python",
        code: `from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
import redis
import json
from pydantic import BaseModel

app = FastAPI(title="ML Model Serving API")
model_registry = {}
feature_store = redis.Redis(host="redis", port=6379, db=0)

class PredictionRequest(BaseModel):
    model_id: str
    model_version: str = "latest"
    features: list
    request_id: str

class PredictionResponse(BaseModel):
    prediction: list
    model_version: str
    latency_ms: float
    request_id: str

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    model_key = f"{request.model_id}:{request.model_version}"
    
    # Load model from registry or cache
    if model_key not in model_registry:
        try:
            model_path = f"/models/{model_key}"
            model_registry[model_key] = tf.saved_model.load(model_path)
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Model not found: {str(e)}")
    
    # Get model and make prediction
    model = model_registry[model_key]
    start_time = time.time()
    
    # Enhance features with data from feature store
    enhanced_features = _enhance_features(request.features, request.request_id)
    
    # Run prediction
    prediction = model.signatures["serving_default"](
        tf.constant(enhanced_features)
    )
    
    latency_ms = (time.time() - start_time) * 1000
    
    # Record metrics
    _record_prediction_metrics(request.model_id, request.model_version, latency_ms)
    
    return PredictionResponse(
        prediction=prediction.numpy().tolist(),
        model_version=request.model_version,
        latency_ms=latency_ms,
        request_id=request.request_id
    )`
      },
      links: {
        demo: "#",
        github: "#",
      }
    },
    {
      title: "Microservices Architecture with Service Mesh",
      description: "A cloud-native microservices platform using Istio service mesh for advanced traffic management",
      icon: <Server className="h-6 w-6" />,
      tags: ["Go", "Kubernetes", "Istio", "gRPC", "MongoDB", "Prometheus"],
      challenge: "Implementing secure, observable, and resilient communication between dozens of microservices across multiple clusters.",
      solution: "Designed a service mesh architecture with Istio, implementing circuit breaking, retries, and canary deployments with detailed metrics collection.",
      codeSnippet: {
        language: "go",
        code: `package main

import (
	"context"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"

	pb "github.com/example/api/proto"
)

var (
	requestCounter = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "api_requests_total",
			Help: "Total number of API requests",
		},
		[]string{"method", "status"},
	)
	requestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "api_request_duration_seconds",
			Help:    "API request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method"},
	)
)

type server struct {
	pb.UnimplementedUserServiceServer
	db *mongo.Client
}

func (s *server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
	timer := prometheus.NewTimer(requestDuration.WithLabelValues("GetUser"))
	defer timer.ObserveDuration()

	if req.Id == "" {
		requestCounter.WithLabelValues("GetUser", "error").Inc()
		return nil, status.Error(codes.InvalidArgument, "user ID cannot be empty")
	}

	// Circuit breaker implementation
	if !isCircuitClosed() {
		requestCounter.WithLabelValues("GetUser", "circuit_open").Inc()
		return nil, status.Error(codes.Unavailable, "circuit breaker open")
	}

	// Database interaction with timeout and retries
	collection := s.db.Database("users").Collection("profiles")
	
	// Set context with timeout
	dbCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Query user from database
	var user pb.User
	err := collection.FindOne(dbCtx, bson.M{"id": req.Id}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			requestCounter.WithLabelValues("GetUser", "not_found").Inc()
			return nil, status.Error(codes.NotFound, "user not found")
		}
		recordCircuitBreakerFailure()
		requestCounter.WithLabelValues("GetUser", "error").Inc()
		return nil, status.Error(codes.Internal, "database error")
	}

	recordCircuitBreakerSuccess()
	requestCounter.WithLabelValues("GetUser", "success").Inc()
	return &user, nil
}

func main() {
	// Connect to MongoDB with connection pooling
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	clientOptions := options.Client().
		ApplyURI("mongodb://mongo:27017").
		SetMaxPoolSize(100).
		SetMinPoolSize(10)
	
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	
	// Start gRPC server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	
	s := grpc.NewServer(
		grpc.UnaryInterceptor(prometheusInterceptor),
	)
	
	pb.RegisterUserServiceServer(s, &server{db: client})
	
	log.Println("Starting gRPC server on :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}`
      },
      links: {
        github: "#",
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const [expandedProject, setExpandedProject] = React.useState<number | null>(null);

  return (
    <Layout>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-3 py-1 mb-6 text-sm font-medium">
            <Folder className="h-4 w-4 mr-2" />
            <span>Projects</span>
          </div>
          <h1 className="mb-6">
            Technical <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A showcase of my recent backend engineering and system architecture work, 
            featuring complex technical challenges and solutions.
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto grid gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="glass rounded-lg overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md text-primary mr-3">
                      {project.icon}
                    </div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.links?.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="skill-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {expandedProject === index ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {project.challenge && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-2">Challenge</h4>
                        <p className="text-muted-foreground">
                          {project.challenge}
                        </p>
                      </div>
                    )}

                    {project.solution && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-2">Solution</h4>
                        <p className="text-muted-foreground">
                          {project.solution}
                        </p>
                      </div>
                    )}

                    {project.codeSnippet && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-2">Code Sample</h4>
                        <div className="code-block">
                          <pre>
                            <code>{project.codeSnippet.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="mt-2"
                      onClick={() => setExpandedProject(null)}
                    >
                      Show Less
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setExpandedProject(index)}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    View Details & Code
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Projects;
