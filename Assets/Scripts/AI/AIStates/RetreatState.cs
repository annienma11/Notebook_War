using UnityEngine;

namespace NotebookWar.AI
{
    public class RetreatState : IEnemyState
    {
        private EnemyBase enemy;
        private Vector3 retreatPosition;
        private float retreatDistance = 15f;
        private float healTime = 3f;
        private float healTimer = 0f;
        private bool hasReachedRetreatPosition = false;

        public RetreatState(EnemyBase enemyBase)
        {
            enemy = enemyBase;
            CalculateRetreatPosition();
        }

        public void Enter()
        {
            enemy.MoveTo(retreatPosition);
            healTimer = 0f;
            hasReachedRetreatPosition = false;
        }

        public void Update()
        {
            // Check if reached retreat position
            if (!hasReachedRetreatPosition && HasReachedDestination())
            {
                hasReachedRetreatPosition = true;
                enemy.StopMoving();
            }

            // If at retreat position, start healing/recovering
            if (hasReachedRetreatPosition)
            {
                healTimer += Time.deltaTime;
                
                // Simple health regeneration
                if (healTimer >= healTime)
                {
                    // Return to patrol or engage based on player visibility
                    if (enemy.CanSeePlayer())
                    {
                        // Transition to engage state - will need state machine reference
                        return;
                    }
                    else
                    {
                        // Transition to patrol state - will need state machine reference
                        return;
                    }
                }
            }

            // If player gets too close during retreat, continue retreating
            if (enemy.CanSeePlayer())
            {
                float distanceToPlayer = Vector3.Distance(enemy.transform.position, enemy.GetPlayer().position);
                if (distanceToPlayer < retreatDistance * 0.5f)
                {
                    // Calculate new retreat position further away
                    CalculateRetreatPosition();
                    enemy.MoveTo(retreatPosition);
                    hasReachedRetreatPosition = false;
                }
            }
        }

        public void Exit()
        {
            enemy.StopMoving();
        }

        private void CalculateRetreatPosition()
        {
            if (enemy.GetPlayer() == null)
            {
                // Retreat to a random position
                Vector3 randomDirection = Random.insideUnitSphere;
                randomDirection.y = 0;
                randomDirection.Normalize();
                retreatPosition = enemy.transform.position + randomDirection * retreatDistance;
                return;
            }

            // Retreat away from player
            Vector3 directionAwayFromPlayer = (enemy.transform.position - enemy.GetPlayer().position).normalized;
            retreatPosition = enemy.transform.position + directionAwayFromPlayer * retreatDistance;
        }

        private bool HasReachedDestination()
        {
            if (enemy.GetAgent() == null) return true;
            
            return !enemy.GetAgent().pathPending && 
                   enemy.GetAgent().remainingDistance < 2f;
        }
    }
}