using UnityEngine;

namespace NotebookWar.AI
{
    public class PatrolState : IEnemyState
    {
        private EnemyBase enemy;
        private Vector3[] patrolPoints;
        private int currentPatrolIndex = 0;
        private float waitTime = 2f;
        private float waitTimer = 0f;
        private bool isWaiting = false;

        public PatrolState(EnemyBase enemyBase)
        {
            enemy = enemyBase;
            InitializePatrolPoints();
        }

        public void Enter()
        {
            if (patrolPoints.Length > 0)
            {
                enemy.MoveTo(patrolPoints[currentPatrolIndex]);
            }
        }

        public void Update()
        {
            // Check if player is detected
            if (enemy.CanSeePlayer())
            {
                // Need to access state machine through a different method
                return;
            }

            // Handle patrol movement
            if (isWaiting)
            {
                waitTimer += Time.deltaTime;
                if (waitTimer >= waitTime)
                {
                    isWaiting = false;
                    waitTimer = 0f;
                    MoveToNextPatrolPoint();
                }
            }
            else
            {
                // Check if reached current patrol point
                if (HasReachedDestination())
                {
                    isWaiting = true;
                }
            }
        }

        public void Exit()
        {
            enemy.StopMoving();
        }

        private void InitializePatrolPoints()
        {
            // Try to find patrol points as child objects
            Transform patrolParent = enemy.transform.Find("PatrolPoints");
            if (patrolParent != null)
            {
                patrolPoints = new Vector3[patrolParent.childCount];
                for (int i = 0; i < patrolParent.childCount; i++)
                {
                    patrolPoints[i] = patrolParent.GetChild(i).position;
                }
            }
            else
            {
                // Create default patrol points around the enemy's starting position
                Vector3 startPos = enemy.transform.position;
                patrolPoints = new Vector3[]
                {
                    startPos,
                    startPos + Vector3.forward * 5f,
                    startPos + Vector3.right * 5f,
                    startPos + Vector3.back * 5f,
                    startPos + Vector3.left * 5f
                };
            }
        }

        private void MoveToNextPatrolPoint()
        {
            if (patrolPoints.Length == 0) return;

            currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Length;
            enemy.MoveTo(patrolPoints[currentPatrolIndex]);
        }

        private bool HasReachedDestination()
        {
            if (enemy.GetAgent() == null) return true;
            
            return !enemy.GetAgent().pathPending && 
                   enemy.GetAgent().remainingDistance < 0.5f;
        }
    }
}