using UnityEngine;
using NotebookWar.Pooling;

namespace NotebookWar.Weapons
{
    public class Grenade : WeaponBase
    {
        [Header("Grenade Specific")]
        [SerializeField] private GameObject grenadePrefab;
        [SerializeField] private float throwForce = 15f;
        [SerializeField] private float explosionRadius = 8f;
        [SerializeField] private float fuseTime = 3f;
        [SerializeField] private LayerMask explosionLayers;
        
        private ObjectPool grenadePool;

        protected override void Awake()
        {
            base.Awake();
            
            // Initialize grenade pool
            if (grenadePrefab != null)
            {
                grenadePool = new ObjectPool(grenadePrefab, 10);
            }
        }

        protected override void Fire()
        {
            if (grenadePool == null) return;

            currentAmmo--;
            nextFireTime = Time.time + weaponData.fireRate;

            // Spawn and throw grenade
            GameObject grenadeObj = grenadePool.Get();
            grenadeObj.transform.position = firePoint.position;
            
            // Calculate throw trajectory
            Vector3 throwDirection = CalculateThrowDirection();
            
            Rigidbody grenadeRb = grenadeObj.GetComponent<Rigidbody>();
            if (grenadeRb != null)
            {
                grenadeRb.velocity = Vector3.zero;
                grenadeRb.AddForce(throwDirection * throwForce, ForceMode.VelocityChange);
            }

            // Set up grenade component
            GrenadeProjectile grenadeScript = grenadeObj.GetComponent<GrenadeProjectile>();
            if (grenadeScript != null)
            {
                grenadeScript.Initialize(fuseTime, explosionRadius, weaponData.damage, explosionLayers, grenadePool);
            }
        }

        private Vector3 CalculateThrowDirection()
        {
            // Add slight upward arc for grenade trajectory
            Vector3 forward = firePoint.forward;
            Vector3 up = firePoint.up;
            
            return (forward + up * 0.3f).normalized;
        }

        protected override void OnHit(RaycastHit hit)
        {
            // Grenades don't use raycast hits
        }
    }

    public class GrenadeProjectile : MonoBehaviour
    {
        private float fuseTime;
        private float explosionRadius;
        private float damage;
        private LayerMask explosionLayers;
        private ObjectPool pool;
        private bool isArmed = false;

        public void Initialize(float fuse, float radius, float dmg, LayerMask layers, ObjectPool objectPool)
        {
            fuseTime = fuse;
            explosionRadius = radius;
            damage = dmg;
            explosionLayers = layers;
            pool = objectPool;
            isArmed = true;
            
            // Start fuse timer
            Invoke(nameof(Explode), fuseTime);
        }

        private void OnCollisionEnter(Collision collision)
        {
            // Grenades can explode on impact with enemies (optional)
            if (isArmed && collision.gameObject.CompareTag("Enemy"))
            {
                CancelInvoke(nameof(Explode));
                Explode();
            }
        }

        private void Explode()
        {
            if (!isArmed) return;
            
            isArmed = false;

            // Find all objects in explosion radius
            Collider[] hitColliders = Physics.OverlapSphere(transform.position, explosionRadius, explosionLayers);
            
            foreach (Collider hitCollider in hitColliders)
            {
                // Calculate damage based on distance
                float distance = Vector3.Distance(transform.position, hitCollider.transform.position);
                float damageMultiplier = 1f - (distance / explosionRadius);
                float finalDamage = damage * damageMultiplier;

                IDamageable damageable = hitCollider.GetComponent<IDamageable>();
                if (damageable != null)
                {
                    damageable.TakeDamage(finalDamage);
                }

                // Apply explosion force to rigidbodies
                Rigidbody rb = hitCollider.GetComponent<Rigidbody>();
                if (rb != null)
                {
                    Vector3 explosionDirection = (hitCollider.transform.position - transform.position).normalized;
                    rb.AddForce(explosionDirection * (finalDamage * 10f), ForceMode.Impulse);
                }
            }

            // Return to pool
            if (pool != null)
            {
                pool.Return(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void OnDrawGizmosSelected()
        {
            // Visualize explosion radius in editor
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, explosionRadius);
        }
    }
}